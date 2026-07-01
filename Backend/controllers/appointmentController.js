import Appointment from "../models/Appointment.js";
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

    const invoiceNumber = `INV-${Date.now()}`;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      department,
      date,
      time,
      notes,
      paymentAmount: doctorData.fees || 0,
      paymentStatus: "pending",
      invoiceNumber,
    });

    // Patient email
    await sendEmail({
      to: req.user.email,
      subject: "Appointment Booked Successfully",
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Your appointment with Dr. ${doctorData.name} has been booked.</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Status:</strong> Pending Payment</p>
      `,
    });

    // Doctor email
    await sendEmail({
      to: doctorData.email,
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Notification</h2>
        <p>You have a new appointment booked.</p>
        <p><strong>Patient:</strong> ${req.user.name}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
      `,
    });

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

    const allowedStatuses = ["approved", "rejected", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status update",
      });
    }

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

    const patient = await User.findById(appointment.patient);

    if (patient) {
      await sendEmail({
        to: patient.email,
        subject: `Appointment ${status}`,
        html: `
          <h2>Appointment Status Updated</h2>
          <p>Your appointment has been <strong>${status}</strong>.</p>
        `,
      });
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
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return res.status(500).json({
        message: "Stripe Secret Key missing in .env",
      });
    }

    const stripe = new Stripe(stripeKey);

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
              description: appointment.department,
            },
            unit_amount: appointment.paymentAmount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success/${appointment._id}`,
      cancel_url: `${process.env.CLIENT_URL}/appointments`,

      metadata: {
        appointmentId: appointment._id.toString(),
      },
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
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "paid";
    appointment.paymentMethod = "Stripe";
    appointment.transactionId = `STRIPE-${Date.now()}`;

    await appointment.save();

    await sendEmail({
      to: req.user.email,
      subject: "Payment Successful",
      html: `
        <h2>Payment Confirmation</h2>
        <p>Your payment has been received successfully.</p>
        <p><strong>Invoice Number:</strong> ${appointment.invoiceNumber}</p>
        <p><strong>Amount:</strong> ₹${appointment.paymentAmount}</p>
        <p><strong>Transaction ID:</strong> ${appointment.transactionId}</p>
      `,
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

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "Cannot cancel this appointment",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
