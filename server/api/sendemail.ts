// import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';
// import shell from "shelljs"

export default defineEventHandler(async (event) => {
  
  const db = new Database('database.db');
  let ret = []
  let link = ""
  // db.pragma('journal_mode = WAL');
  let req = await readBody(event)

  const url = getRequestURL(event)
  
  console.log('url::>', url.origin);
  
  const clientsIds = req.clients.map(x=>`'${x}'`).join(',')
  console.log('clientsIds:', clientsIds);
  

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     // auth: {
    //     //     user: 'magawebtec@gmail.com',
    //     //     pass: 'gkvv trye yzrp bxmp'
    //     // },
    //       auth: {
    //         user: 'contato@magaweb.com.br',
    //         pass: 'mariaclara108'
    //     }
    // });


    const client_final_report_build = async (year, month, client) => {
      const sql = `
      select 
          COUNT(reports.id), 
          reports.year, 
          reports.month, 
          GROUP_CONCAT(reports.name) as nome, 
          GROUP_CONCAT(reports.file) as files, 
          GROUP_CONCAT(products.name) as tags 
      from 
          reports, 
          products, 
          clients 
      where 
          reports.tag = products.id AND 
          instr(clients.tags, reports.tag) > 0 AND
          clients.id like '${client.id}' AND
          reports.year LIKE '${year}' AND
          reports.month LIKE '${month}' 
      GROUP BY 
          reports.year, 
          reports.month 
      order by 
          year DESC, 
          month DESC 
      ` 
      // let data_ = await $fetch('/api/dbservices?sql=' + sql.replace(/\s+/g,' ').trim());
      let data_ = db.prepare(sql.replace(/\s+/g,' ').trim()).all()
     
      // data_ = data_.filter(x => x.year == year && x.month == month)
      // await $fetch(`/api/shell?year=${year}&month=${month}&client=${JSON.stringify(client)}&files=${data_[0].files}`)
      console.log("whay stop?");
      if (data_[0]?.files){
        let data2_ = await $fetch(`http://216.238.98.143:3005/test?year=${year}&month=${month}&client=${JSON.stringify(client)}&files=${data_[0].files.split(',').map(x=>'/home/maga/dev/ohxide/upload/'+x).join(',')}`);
        console.log('data2_', data2_);
        return data2_
      }else{
        // return "Erro: Não existem relatórios definidos"
        return false
      }
    }


    const clients = db.prepare(`select * from clients where status like 'ativo' and id in (${clientsIds})`).all()
    console.log(clients);

    // clients.forEach(async x=>{
    //   let a = await client_final_report_build(req.year, req.month, clients.filter(xx=>xx.id==x.id)[0])
    //   console.log(`${clients.find(xx=>xx.id==x.id).name} ---> ${a}`)
    //   ret.push(`${clients.find(xx=>xx.id==x.id).name} ---> ${a}`)
    // })
    
    await Promise.all(
     clients.map(async (x, index)=>{
      
      const option = { month: 'long'}
      const locale = 'pt-br'
      const monthName = new Date().toLocaleDateString( locale, option)
      const meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro")
      let message = req.message
      message = message.replaceAll("[nome]", x.name)
      message = message.replaceAll("[username]", x.username)
      message = message.replaceAll("[empresa]", x.empresa)
      message = message.replaceAll("[email]", x.email)
      message = message.replaceAll("[ano]", req.year)
      message = message.replaceAll("[mes]", meses[req.month-1])
      message = message.replaceAll("[mês]", meses[req.month-1])
      // ret.push(`Email enviado para: ${x.email}`)

      if (req.linktext){
        // link = `<br/><a href="${url.origin}/download?year=${req.year}&month=${req.month}&client=${x.id}">${req.linktext}</a>`
        link = `<br/><a href="${url.origin}/file'/${x.id}_report_${req.year}_${req.month}.pdf">${req.linktext}</a>`
      }
      
      // download(req.year, req.month, clients.filter(xx=>xx.id==x.id)[0])
    
      let get_final_report_name = await client_final_report_build(req.year, req.month, clients.filter(xx=>xx.id==x.id)[0])
     
      
      if (get_final_report_name) {
        console.log(`/home/maga/dev/ohxide/reports/${get_final_report_name}`);
        const dataEmailSend = await $fetch('/api/mailersend', {
          method: 'POST',
          body: JSON.stringify({
            to: x.email,
            destinatario: x.email,
            // attach: `/home/maga/dev/ohxide/reports/${x.id}_report_${req.year}_${req.month}.pdf`,
            attach: `/home/maga/dev/ohxide/reports/${get_final_report_name}`,
            subject: req.subject,
            // body: req.subject,
            html: `
              <img src="https://bucket.mailersendapp.com/neqvygmrw5l0p7w2/jy7zpl9359ol5vx6/images/9ba4cd5b-1751-4410-adea-640b39425b51.jpeg" style="width: 70px;"/><br/>
              ${message.replaceAll("\n", "<br/>")}
              ${link}
            `
          })
        })
        console.log("dataEmailSend:", dataEmailSend);
        
        ret.push(`${clients.find(xx=>xx.id==x.id).name} ---> OK`)
      }else{
        ret.push(`${clients.find(xx=>xx.id==x.id).name} ---> Erro. Não existem arquivos`)

      }
     
     
     
    })
    )
    
    console.log('ret>', ret);
    return ret

})