// import puppeteer from "puppeteer";

// async function generatePDF(users) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   const styles = `
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         margin: 0;
//         padding: 20px;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 30px;
//         font-size: 12px;
//       }
//       th, td {
//         padding: 8px;
//         text-align: left;
//         border: 1px solid #ddd;
//         vertical-align: top;
//       }
//       th {
//         background-color: #4CAF50;
//         color: white;
//       }
//       td {
//         background-color: #f9f9f9;
//       }
//       img {
//         width: 80px;
//         height: 80px;
//         object-fit: cover;
//         border-radius: 4px;
//         margin-right: 5px;
//       }
//       .video-link {
//         display: block;
//         color: #1a0dab;
//         text-decoration: underline;
//         margin-bottom: 4px;
//       }
//       .page-break {
//         page-break-before: always;
//       }
//     </style>
//   `;

//   await page.setContent(`
//     <html>
//       <head>${styles}</head>
//       <body><div id="content"></div></body>
//     </html>
//   `);

//   const contentElement = await page.$("#content");

//   const batchSize = 50;
//   const batches = Math.ceil(users.length / batchSize);

//   for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
//     const batchUsers = users.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

//     let batchHtml = `
//       <table>
//         <tr>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Age</th>
//           <th>Height</th>
//           <th>Weight</th>
//           <th>Location</th>
//           <th>Photos</th>
//           <th>Videos</th>
//         </tr>
//     `;

//     for (let user of batchUsers) {
//       batchHtml += `
//         <tr>
//           <td>${user.name}</td>
//           <td>${user.email}</td>
//           <td>${user.age || "-"}</td>
//           <td>${user.height || "-"}</td>
//           <td>${user.weight || "-"}</td>
//           <td>${user.location || "-"}</td>
//           <td>
//       `;

//       const photos = user.photoUrls?.slice(0, 2) || [];
//       for (let photoUrl of photos) {
//         batchHtml += `<img src="${photoUrl}" alt="photo" />`; // Using CDN URL directly
//       }

//       batchHtml += `</td><td>`;

//       const videoLinks = user.videoUrls || [];
//       for (let videoUrl of videoLinks) {
//         batchHtml += `<a href="${videoUrl}" class="video-link">${videoUrl}</a>`;
//       }

//       batchHtml += `</td></tr>`;
//     }

//     batchHtml += `</table>`;

//     // Insert the batch HTML into the page
//     await page.evaluate((html) => {
//       document.getElementById("content").insertAdjacentHTML('beforeend', html);
//     }, batchHtml);

//     // Add page break after each batch
//     await page.evaluate(() => {
//       document.getElementById("content").innerHTML += "<div class='page-break'></div>";
//     });
//   }

//   // Ensure all images are loaded before generating PDF
//   await page.evaluate(async () => {
//     const images = Array.from(document.images);
//     await Promise.all(
//       images.map(img => {
//         if (img.complete) return Promise.resolve();
//         return new Promise(resolve => {
//           img.onload = img.onerror = resolve;
//         });
//       })
//     );
//   });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: { top: 30, bottom: 30, left: 20, right: 20 },
//   });

//   await browser.close();
//   return pdfBuffer;
// }

// export async function POST(req) {
//   const { users } = await req.json();
//   const pdfBuffer = await generatePDF(users);

//   return new Response(pdfBuffer, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=interested-users.pdf",
//     },
//   });
// }




















// // /api/export-pdf

import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req) {
  try {
    const { users } = await req.json();
    
    // Generate HTML for the PDF
    const html = generateHTML(users);
    
    // Launch browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(html);
    
    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await browser.close();
    
    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="interested-users.pdf"'
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

// function generateHTML(users) {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <title>Interested Users</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           margin: 0;
//           padding: 20px;
//           font-size: 10px;
//         }
//         h1 {
//           color: #5B408C;
//           text-align: center;
//           margin-bottom: 20px;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         th, td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: left;
//         }
//         th {
//           background-color: #f2f2f2;
//           font-weight: bold;
//         }
//         tr:nth-child(even) {
//           background-color: #f9f9f9;
//         }
//         .project-links {
//           margin: 0;
//           padding-left: 20px;
//         }
//         .project-links li {
//           margin-bottom: 3px;
//           word-break: break-all;
//         }
//         .no-links {
//           color: #999;
//           font-style: italic;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Interested Users (${users.length})</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Age</th>
//             <th>Location</th>
//             <th>Height</th>
//             <th>Weight</th>
//             <th>Project Links</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${users.map(user => `
//             <tr>
//               <td>${user.name || ''}</td>
//               <td>${user.email || ''}</td>
//               <td>${user.age || ''}</td>
//               <td>${user.location || ''}</td>
//               <td>${user.height || ''}</td>
//               <td>${user.weight || ''}</td>
//               <td>
//                 ${user.projectLinks && user.projectLinks.length > 0 
//                   ? `<ul class="project-links">
//                       ${user.projectLinks.map(link => `<li>${link}</li>`).join('')}
//                     </ul>`
//                   : `<span class="no-links">No links provided</span>`
//                 }
//               </td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </body>
//     </html>
//   `;
// }





function generateHTML(users) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Interested Users</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 10px;
        }
        h1 {
          color: #5B408C;
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .project-links {
          margin: 0;
          padding-left: 20px;
        }
        .project-links li {
          margin-bottom: 3px;
          word-break: break-word;
        }
        .no-links {
          color: #999;
          font-style: italic;
        }
        .photo-container img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 4px;
        }
      </style>
    </head>
    <body>
      <h1>Interested Users (${users.length})</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Location</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Project Links</th>
            <th>Photos</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.name || ''}</td>
              <td>${user.email || ''}</td>
              <td>${user.age || ''}</td>
              <td>${user.location || ''}</td>
              <td>${user.height || ''}</td>
              <td>${user.weight || ''}</td>
              <td>
                ${user.projectLinks && user.projectLinks.length > 0 
                  ? `<ul class="project-links">
                      ${user.projectLinks.map(link => `<li>${link}</li>`).join('')}
                    </ul>`
                  : `<span class="no-links">No links provided</span>`
                }
              </td>
              <td>
                <div class="photo-container">
                  ${(user.photoUrls || []).map(url => {
                    const finalUrl = url.startsWith("http") ? url : `https://diya9wnfn63f0.cloudfront.net/${url}`;
                    return `<img src="${finalUrl}" alt="photo" />`;
                  }).join('')}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
}