import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import User from "../models/User.js";
import Stripe from "stripe";
import sendEmail from "../utils/sendEmail.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, department, date, time, notes } = req.body;

    const doctorData = await User.findById(doctor);

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const selectedDate = new Date(date);

    const selectedAvailability = doctorData.availability.find(
      (item) => item.date === date,
    );

    if (!selectedAvailability) {
      return res.status(400).json({
        message: "Doctor not available on selected date",
      });
    }

    if (!selectedAvailability.slots.includes(time)) {
      return res.status(400).json({
        message: "Selected slot not available",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor,
      date,
      time,
      status: { $in: ["pending", "approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This slot is already booked",
      });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      department,
      date: selectedDate,
      time,
      notes,
      paymentAmount: doctorData.fees || 0,
      paymentStatus: "pending",
      invoiceNumber,
    });

    const latestReport = await Report.findOne({
      patient: req.user._id,
    }).sort({ createdAt: -1 });

    if (latestReport) {
      latestReport.doctor = doctorData._id;
      await latestReport.save();

      console.log("Report linked:", latestReport._id);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `Appointment booked with Dr. ${doctorData.name} on ${date} at ${time}`,
        },
      },
    });

    sendEmail({
      to: req.user.email,
      subject: "Appointment Booked Successfully",
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Your appointment with Dr. ${doctorData.name} has been booked.</p>
      `,
    }).catch((err) => console.log("Patient email failed:", err.message));

    sendEmail({
      to: doctorData.email,
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Notification</h2>
        <p>New appointment booked by ${req.user.name}</p>
      `,
    }).catch((err) => console.log("Doctor email failed:", err.message));

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate("doctor", "name email specialization fees")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    await appointment.save();

    if (status === "completed") {
      await User.updateOne(
        {
          _id: req.user._id,
          "availability.date": appointment.date.toISOString().split("T")[0],
        },
        {
          $pull: {
            "availability.$.slots": appointment.time,
          },
        },
      );
    }

    const patient = await User.findById(appointment.patient);

    if (patient) {
      patient.notifications.push({
        message: `Appointment with Dr. ${req.user.name} is ${status}`,
        read: false,
      });

      await patient.save();

      sendEmail({
        to: patient.email,
        subject: `Appointment ${status}`,
        html: `
          <h2>Appointment Status Updated</h2>
          <p>Your appointment has been ${status}</p>
        `,
      }).catch((err) => console.log("Status email failed:", err.message));
    }

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markAppointmentPaid = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("doctor");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Appointment with Dr. ${appointment.doctor.name}`,
            },
            unit_amount: appointment.paymentAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success/${appointment._id}`,
      cancel_url: `${process.env.CLIENT_URL}/appointments`,
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "paid";
    appointment.paymentMethod = "Stripe";
    appointment.transactionId = `STRIPE-${Date.now()}`;

    await appointment.save();

    await User.findByIdAndUpdate(appointment.patient, {
      $push: {
        notifications: {
          message: `Payment successful for appointment #${appointment.invoiceNumber}`,
        },
      },
    });

    res.status(200).json({
      message: "Payment verified successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAppointmentInvoice = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor", "name specialization fees");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      invoiceNumber: appointment.invoiceNumber,
      patient: appointment.patient.name,
      doctor: appointment.doctor.name,
      specialization: appointment.doctor.specialization,
      amount: appointment.paymentAmount,
      paymentStatus: appointment.paymentStatus,
      transactionId: appointment.transactionId,
      date: appointment.date,
      time: appointment.time,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Appointment cannot be cancelled",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `Appointment cancelled for ${appointment.date.toISOString().split("T")[0]} at ${appointment.time}`,
        },
      },
    });

    res.status(200).json({
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: new Date(date),
      status: { $in: ["pending", "approved"] },
    });

    const bookedSlots = appointments.map((item) => item.time);

    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("doctor");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot reschedule cancelled appointment",
      });
    }

    const selectedAvailability = appointment.doctor.availability.find(
      (item) => item.date === date,
    );

    if (!selectedAvailability) {
      return res.status(400).json({
        message: "Doctor not available on selected date",
      });
    }

    if (!selectedAvailability.slots.includes(time)) {
      return res.status(400).json({
        message: "Selected slot not available",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: appointment.doctor._id,
      date,
      time,
      status: { $in: ["pending", "approved"] },
      _id: { $ne: appointment._id },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = "pending";

    await appointment.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `Appointment rescheduled to ${date} at ${time}`,
        },
      },
    });

    await User.findByIdAndUpdate(appointment.doctor._id, {
      $push: {
        notifications: {
          message: `Appointment rescheduled by patient to ${date} at ${time}`,
        },
      },
    });

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    console.log("========== FEEDBACK REQUEST ==========");
    console.log("Request Body:", req.body);
    console.log("Appointment ID:", req.params.id);
    console.log("Logged-in Patient:", req.user._id);

    const { rating, review } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    console.log("Appointment Found:", appointment);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    console.log("Current Status:", appointment.status);
    console.log("Current Rating:", appointment.rating);

    if (appointment.status !== "completed") {
      return res.status(400).json({
        message: "You can only review completed appointments",
      });
    }

    if (appointment.rating) {
      return res.status(400).json({
        message: "Feedback already submitted",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    appointment.rating = Number(rating);
    appointment.feedback = review || "";
    appointment.feedbackDate = new Date();

    console.log("Before Save:", appointment);

    await appointment.save();

    console.log("Saved Successfully!");

    const updatedAppointment = await Appointment.findById(req.params.id);

    console.log("After Save:", updatedAppointment);

    await User.findByIdAndUpdate(appointment.doctor, {
      $push: {
        notifications: {
          message: `${req.user.name} submitted feedback for your appointment.`,
          read: false,
        },
      },
    });

    res.status(200).json({
      message: "Feedback submitted successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.log("SUBMIT FEEDBACK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
