// ! send video without saving it
import nodemailer from "nodemailer";
import { Readable } from "stream";

export async function POST(req) {
  let name;
  let fileBuffer;
  try {
    const data = await req.formData();
    name = data.get("name");
    if (!name) throw new Error("No se pudo obtener el nombre del archivo");
    const file = data.get("videoFile");
    if (!file) throw new Error("No se pudo obtener el archivo");

    console.log(name, file);

    const bytes = await file.arrayBuffer();
    fileBuffer = Buffer.from(bytes);
    if (!fileBuffer) throw new Error("No se pudo transformar el archivo");
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Error al subir el archivo" }),
      {
        status: 500,
      }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: "facuaragon34@gmail.com", //facundo_aragon@hotmail.com  facuaragon34@gmail.com
      subject: `Te han enviado un video`,
      attachments: [
        {
          filename: `saludo-de-${name}.MOV`,
          content: stream,
          cid: "videoAttachment",
          contentType: "video/quicktime",
        },
      ],
      html: `
      <html>
        <body>
          <h1>Te han enviado un video</h1>
          <p>Revisa el archivo adjunto</p>
          <video width="320" height="240" controls>
            <source src="cid:videoAttachment" type="video/quicktime"> <!-- Cambiar el tipo de contenido (MIME type) del video -->
            Tu navegador no soporta el elemento de video.
          </video>
        </body>
      </html>
    `,
    });
  } catch (error) {
    console.log(error);
  }

  return new Response(JSON.stringify({ message: "Uploading file" }));
}

//! Cloudinary
// import nodemailer from "nodemailer";
// import { Readable } from "stream";
// import cloudinary from "cloudinary";

// // Cloudinary Crendetials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   let name;
//   let fileBuffer;

//   try {
//     const data = await req.formData();
//     name = data.get("name");
//     if (!name) throw new Error("No se pudo obtener el nombre del archivo");
//     const file = data.get("videoFile");
//     if (!file) throw new Error("No se pudo obtener el archivo");

//     console.log(name, file);

//     const bytes = await file.arrayBuffer();
//     fileBuffer = Buffer.from(bytes);
//     if (!fileBuffer) throw new Error("No se pudo transformar el archivo");

//     // Upload the video to Cloudinary
//     const cloudinaryUpload = await cloudinary.v2.uploader.upload_stream(
//       { resource_type: "video" },
//       async (error, result) => {
//         if (error) {
//           console.error(error);
//           throw new Error("Error al subir el video a Cloudinary");
//         }
//         const videoUrl = result.secure_url;

//         // Send the email with the Cloudinary URL
//         const transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           secure: true,
//           auth: {
//             user: process.env.SMTP_EMAIL,
//             pass: process.env.SMTP_PASSWORD,
//           },
//         });

//         await transporter.sendMail({
//           from: process.env.SMTP_EMAIL,
//           to: "facuaragon34@gmail.com", // Replace with your recipient's email
//           subject: `Te han enviado un video`,
//           html: `
//           <html>
//             <body>
//               <h1>Te han enviado un video</h1>
//               <p>Revisa el video <a href="${videoUrl}">aquí</a></p>
//               <video width="320" height="240" controls>
//         <source src="${videoUrl}" type="video/mp4">
//         Tu navegador no soporta el elemento de video.
//       </video>
//             </body>
//           </html>
//         `,
//         });
//       }
//     );

//     const stream = new Readable();
//     stream.push(fileBuffer);
//     stream.push(null);

//     stream.pipe(cloudinaryUpload);
//   } catch (error) {
//     console.log(error);
//     return new Response(JSON.stringify({ message: "Error uploading file" }), {
//       status: 500,
//     });
//   }

//   return new Response(JSON.stringify({ message: "Uploading file" }));
// }

//! funcion que guarda el video en el directorio

// import { writeFile, unlink } from "fs/promises";
// import path from "path";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   let name;
//   let filePath;
//   try {
//     const data = await req.formData();
//     name = data.get("name");
//     if (!name) throw new Error("No se pudo obtener el nombre del archivo");
//     const file = data.get("videoFile");
//     if (!file) throw new Error("No se pudo obtener el archivo");

//     console.log(name, file);

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     if (!buffer) throw new Error("No se pudo transformar el archivo");

//     filePath = path.join(process.cwd(), "public", `saludo-de-${name}.mp4`);
//     writeFile(filePath, buffer);
//     console.log("file loaded to: ", filePath);
//   } catch (error) {
//     console.log(error);
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: "facundo_aragon@hotmail.com",
//       subject: `Te ahn enviado un video`,
//       attachments: [
//         {
//           filename: `saludo-de-${name}.mp4`,
//           path: filePath,
//         },
//       ],
//       html: `te han enviado un video`,
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   //eliminar archivo => como hago?
//   await unlink(filePath);
//   console.log("File deleted: ", filePath);

//   return new Response(JSON.stringify({ message: "Uploading file" }));
// }
