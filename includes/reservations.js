var conn = require('./db');
const Pagination = require('./Pagination');
var moment = require('moment')

module.exports = {

    render(req, res, error, success){

        res.render('reservations', { 
            title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma mesa',
            body:req.body,
            error:error,
            success: success
        });

    },

    save(fields){

        return new Promise((resolve, reject)=>{

            if (fields.date.indexOf('/') > -1) {

                let date = fields.date.split('/')
                fields.date = `${date[2]}-${date[1]}-${date[0]}`
                
            }     

            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ]

            if (fields.id > 0) {

                params.push(fields.id)

                query = `update tb_reservations set name = ?, email = ?, people = ? ,date = ?, time = ? where id = ?`
                
            }

            else{

                query = 'insert into tb_reservations (name, email, people, date, time) values (?, ?, ?, ?, ?)'

            }

            conn.query(query, params, (err, results)=>{

                if (err) { 
                    reject(err)
                }
                else{
                    resolve(results)
                }

            })

        })

    },

    getReservations(req){

        return new Promise((resolve, reject)=>{

            let page = req.query.page
            let dtstart = req.query.start
            let dtend = req.query.end

            if (!page) {
                page = 1
            }
    
            let params = []
    
            if (dtstart && dtend) {
                params.push(dtstart, dtend)
            }
    
            let pag = new Pagination(
                `select sql_calc_found_rows * from  tb_reservations 
                ${(dtstart && dtend)? 'where date between ? and ?' : '' }  
                order by name limit ?, ?`,params
            )

            pag.getPage(page).then(data =>{

                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                })

            })

        })
 
    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query('delete from tb_reservations where id = ?',[
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

    chart(req){

        return new Promise((resolve, reject)=>{

            conn.query(`
                select 
                    concat(year(date), "-", month(date)) as date,
                    count(*) as total,
                    sum(people) / count(*) as avg_people
                from tb_reservations
                where
                    date between ? and ?
                group by (date), month(date)
                order by year(date) desc, month(date) desc;`,[
                    req.query.start,
                    req.query.end
                ], (err, results)=>{
                    if (err) {
                        reject(err)
                    }
                    else{
                        let months = []
                        let values = []

                        results.forEach(row=>{
                            console.log(results);
                            months.push(moment(row.date).format('MMM YYYY'))
                            values.push(row.avg_people)

                        })

                        resolve({
                            months,
                            values
                        })
                    }
                })

        })

    },

    dashboard(){

        return new Promise((resolve, reject)=>{

            conn.query(`
                select
                    (select count(*) from tb_contacts) as nrcontacts,
                    (select count(*) from tb_menus) as nrmenus,
                    (select count(*) from tb_reservations) as nrreservations,
                    (select count(*) from tb_users) as nrusers
            `,(err, results)=>{

                if (err) {
                    reject(err)
                }
                else{
                    resolve(results[0])
                }
            
            })

        })

    }

}