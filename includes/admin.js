const conn = require("./db")

module.exports = {

    dashboard(){

        return new Promise((resolve, reject)=>{

            conn.query(`select
                            (select count(*) from tb_contacts) as nrcontacts,
                            (select count(*) from tb_menus) as nrmenus,
                            (select count(*) from tb_reservations) as nrreservations,
                            (select count(*) from tb_users) as nrusers;
            `, (err, results)=>{

                if (err) {
                    reject(err)
                }
                else{
                    resolve(results[0])
                }

            })

        })

    },

    getParams(req, params){

        return Object.assign({}, {
            menus:req.menus,
            user:req.session.user
        }, params)

    },

    getMenus(req){

        let menus = [
            {
                text:'Tela Inicial',
                href:'/admin/',
                icon:'home',
                active:false
            },
            {
                text:'Menu',
                href:'/admin/menus',
                icon:'cutlery',
                active:false
            },
            {
                text:'Reservas',
                href:'/admin/reservations',
                icon:'calendar-check-o',
                active:false
            },
            {
                text:'Contatos',
                href:'/admin/contacts',
                icon:'comments',
                active:false
            },
            {
                text:'Usuários',
                href:'/admin/users',
                icon:'users',
                active:false
            },
            {
                text:'E-mails',
                href:'/admin/emails',
                icon:'envelope',
                active:false
            }
        ]

        menus.map(menu=>{

            if (menu.href == `/admin${req.url}`) {
                menu.active = true
            }

        })

        return menus

    }

}