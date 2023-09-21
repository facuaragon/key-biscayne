// import path from "path";
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
    return new Response(JSON.stringify({ message: "Error uploading file" }), {
      status: 500,
    });
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

// funcion que guarda el video en el directorio

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
