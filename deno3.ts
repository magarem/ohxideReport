//#D9D9D9

// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
// import demoData from "./data_blob.json" assert { type: "json" };
import { mergeAll, mergePdfs } from "https://deno.land/x/pdfrex@v0.0.2/mod.ts";
import { PDFDocument, rgb, degrees } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";


const app = express();
const port = Number(Deno.env.get("PORT")) || 3005;

//create full hex
const fullHex = (hex) => {
  let r = hex.slice(1,2);
  let g = hex.slice(2,3);
  let b = hex.slice(3,4);

  r = parseInt(r+r, 16);
  g = parseInt(g+g, 16);
  b = parseInt(b+b, 16);
  
  // return {r, g, b} 
  return { r, g, b };
}

//convert hex to rgb
const hex2rgb = (hex) => {
    if(hex.length === 4){
      return fullHex(hex);
    }
  
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // return {r, g, b} 
    return { r, g, b };
}

// console.log("config_report", config_report);


// const basePath = "public/upload/reports/"
const basePath = "/home/maga/dev/ohxide/upload/"
const basePath_tosave = "/home/maga/dev/ohxide/reports/"
const netPath = "http://216.238.98.143:3000/file/"

const reqLogger = function (req, _res, next) {
  // console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

app.use(reqLogger);

app.get("/test", async (req, res) => {
  try {

    const tempo = +new Date
    // const req = await readBody(event)
    console.log("To aqui!");
    // console.log('req:', req);

    const db = new DB("database.db");
    // let data = null

    const data = await db.query("select * from config where id like 'config_report'")
  
    db.close();

    const config_report = JSON.parse(data[0][1])

    // const client = JSON.parse(JSON.parse(req.query.client))
    const client = JSON.parse(req.query.client)
    // console.log("client:", client);
    // console.log("client.id:", client.id);

    const clientfiles = req.query.files.split(',')
  
    // const client2 = {
    //   id: req.query.id,
    //   year: req.query.year,
    //   month: req.query.month,
    //   empresa: req.query.empresa,
    //   files: req.query.files.split(',')
    // }
    // console.log('client:', client);

    await mergePdfs(clientfiles, {
      output: basePath_tosave + client.id +"_newmerged.pdf"
    })

    // const response = await fetch(netPath + "newmerged.pdf")
    // console.log("response", response);
    // const existingPdfBytes = await response.arrayBuffer();//This returns an arrayBuffer.
    // console.log('existingPdfBytes', existingPdfBytes);
   
    // console.log(":::::::::::>>>", netPath + client.id +"_newmerged.pdf");

    const existingPdfBytes = await fetch(netPath + client.id + "_newmerged.pdf").then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
   
    let page = null

    for (let t=4; t<pdfDoc.getPageCount()-1; t++){
      page = pdfDoc.getPage(t);

      // page.drawText("Harekrsna!!", {
      //   x: 40,
      //   y: page.getHeight() / 2 + 250,
      //   size: 50,
      //   color: rgb(0.95, 0.1, 0.1),
      //   rotate: degrees(-45),
      //   opacity: 0.5,
      // });
      function hexToRgb(hex) {
        hex   = hex.replace('#', '');
        var r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
        var g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
        var b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
        return rgb(+r/255, +g/255, +b/255);
      }

      const hexColor = hex2rgb(config_report.color)
      page.drawText(client.empresa, {
        x: +config_report.x,
        y: page.getHeight() / 2 + (+config_report.y),
        size: +config_report.size,
        color: hexToRgb(config_report.color),
        rotate: degrees(+config_report.rotate),
        opacity: +config_report.opacity,
      });

    }

    // Save the PDFDocument and write it to a file
    const pdfBytes = await pdfDoc.save();
// await Deno.remove("public/upload/reports/"+Deno.args[0]+'_report.pdf');
// await Deno.writeFile(client.id + '_report.pdf', pdfBytes);

  await Deno.writeFile(`${basePath_tosave}${client.id}_report_${req.query.year}_${req.query.month}_${tempo}.pdf`, pdfBytes);
// Deno.writeFileSync(`${basePath}${client.id}_report_${client.year}_${client.month}.pdf`, pdfBytes);
// await Deno.copyFile(client.id + '_report.pdf', `${basePath}${client.id}_report_${client.year}_${client.month}.pdf`);
// } catch (error) {
//   console.log(error);
// }
// Done! 💥
// console.log(`${client.id}_report_${client.year}_${client.month}.pdf`);
// Deno.exit()
   
    // console.log("!!!!!!!!!!!!!!"+clientfiles)
  res.status(200).send(`${client.id}_report_${req.query.year}_${req.query.month}_${tempo}.pdf`);

   
  } catch (error) {
    console.log(error);
  }
  
});


app.listen(port, () => {
  console.log(`Listening on ${port} ...`);
});