const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'jukianaliana343@gmail.com',
    pass: 'cmgm xzlc cibf rflm'
  },
});

const sendEmail = async (toEmail, subject = 'Selamat Bergabung di Pharmacy Store!', htmlContent = 
      `<p>Halo,</p>
      <p>Selamat bergabung di Pharmacy Store kami!</p>
      <p>Kami sangat senang memiliki Anda sebagai bagian dari pelanggan kami.</p>
      <p>Terima kasih!</p>
      <p>Tim Pharmacy Store</p>`
    ) => {
  try {

    let mailOptions = {
      from: 'jukianaliana343@gmail.com',
      to: toEmail,
      subject: subject,
      html: htmlContent
    };

    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail };