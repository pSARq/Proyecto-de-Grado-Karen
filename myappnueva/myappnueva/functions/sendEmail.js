// functions/sendEmail.js

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tu_correo@gmail.com', // Reemplaza con tu dirección de correo
    pass: 'tu_contraseña', // Reemplaza con tu contraseña
  },
});

// Define la función para enviar correos electrónicos
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Verifica la autenticación del usuario (puedes personalizar esto según tus necesidades)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado.');
  }

  const { to, subject, message } = data;

  // Configura el correo electrónico
  const mailOptions = {
    from: 'tu_correo@gmail.com', // Reemplaza con tu dirección de correo
    to,
    subject,
    text: message,
  };

  try {
    // Envía el correo electrónico
    const result = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', result);

    return { success: true, message: 'Correo electrónico enviado con éxito.' };
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new functions.https.HttpsError('internal', 'Error al enviar el correo electrónico.');
  }
});
