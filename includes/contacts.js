var conn = require('./db')

module.exports = {

    render(req, res, error, success){

        res.render('contacts', { 
            title: 'Contato - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi',
            body: req.body,
            error: error,
            success, success
        });

    },

    save(fields){

        return new Promise((resolve, reject)=>{

            conn.query('insert into tb_contacts (name, email, message) values(?, ?, ?)',[
                fields.name,
                fields.email,
                fields.message
            ],(err, results)=>{

                if (err) {
                    reject(err)
                }
                else{
                    resolve(results)
                }

            })

        })

    }

}