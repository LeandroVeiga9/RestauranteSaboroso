var conn = require('./db')

module.exports = {

    getEmails(){

        return new Promise((resolve, reject) =>{

            conn.query('select * from  tb_emails order by email', (err, results)=>{

                if (err) {
                    reject(err)
                }
        
                resolve(results)
        
            }) 

        })

    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query('delete from tb_emails where id = ?',[
                id
            ], (err, results) =>{

                if (err) {
                    reject(err)
                }
                else{
                    resolve(results)
                }

            })

        })

    },

    save(req){

        return new Promise((resolve, reject)=>{
            
            if (!req.fields.email) {
                reject('escreva o email')
            }
            else{
        
                conn.query('insert into tb_emails (email) values(?)',[
                    req.fields.email
                ],(err, results)=>{
                    if (err) {
                        reject(err.message)
                    }
                    else{
                        resolve(results)
                    }
                })
        
            }

        })

        

    }

}