var conn = require('../includes/db')

module.exports = {

    render(req, res, error){

        res.render("admin/login", {
            body:req.body,
            error: error
        })
 
    },

    login(email, password){

        return new Promise((resolve, reject)=>{

            conn.query('select * from tb_users where email = ?',[
                email
            ],(err, results)=>{

                if (err) {
                    reject(err)
                }
                else{
                    
                    if (!results.length > 0) {

                        reject('Usuario ou senha incorretos')
                    }
                    else{

                        let row = results[0]

                        if (row.password !== password) {

                            reject('Usuario ou senha incorretos')
                        }
                        else{
                            resolve(row)
                        }

                    }                    

                }

            })

        })

    },

    getUsers(){

        return new Promise((resolve, reject) =>{

            conn.query('select * from  tb_users order by name', (err, results)=>{

                if (err) {
                    reject(err)
                }
        
                resolve(results)
        
            }) 

        })

    },

    save(fields, files){

        return new Promise((resolve, reject)=>{

            let query, params = [
                fields.name,
                fields.email
            ]

            if (fields.id > 0){

                params.push(fields.id)

                query = `update tb_users set name = ?, email = ? where id = ?`
                
            }
            else{

                query = "insert into tb_users (name, email, password) values(?, ?, ?)"

                params.push(fields.password)

            }

            conn.query(query, params, (err, results)=>{

                if (err) {
                    reject(e)
                }
                else{

                    resolve(results)

                }

            })

        })

    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query('delete from tb_users where id = ?',[
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

    changePassword(req){

        return new Promise((resolve, reject)=>{

            if (!req.fields.password) {
                reject("Preencha a senha")
            }
            else if (req.fields.password != req.fields.passwordConfirm) {
                reject("Confirme a senha corretamente") 
            }
            else{

                conn.query(`update tb_users set password = ? where id = ?`,[
                    req.fields.password,
                    req.fields.id
                ], (err, results)=>{

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