class HcodeGrid{

    constructor(configs){

        configs.listeners = Object.assign({
            afterUpdateClick:(e)=>{
                $('#modal-update').modal('show')
            },
            afterDeleteClick:(e)=>{
                window.location.reload()
            },
            afterFormCreate:(e)=>{
                window.location.reload()
            },
            afterFormUpdate:(e)=>{
                window.location.reload()
            },
            afterFormCreateError:(e)=>{
                alert('Não foi posivel enviar o formulário')
            },
            afterFormUpdateError:(e)=>{
                alert('Não foi posivel enviar o formulário')
            },
        }, configs.listeners)

        this.options = Object.assign({}, {
            formCreate:"#modal-create form",
            formUpdate:"#modal-update form",
            btnUpdate:"btn-update",
            btnDelete:"btn-delete",
            onUpdateLoad:(form, name, data)=>{
                let input = form.querySelector('[name='+name+']')
                if(input) input.value = data[name]
            }
        }, configs)

        this.formUpdate = document.querySelector(this.options.formUpdate)
        this.rows = [...document.querySelectorAll('table tbody tr')]

        this.initForms()
        this.initButtons()

    }

    initForms(){

        let formCreate = document.querySelector(this.options.formCreate)

        formCreate.save({
            success:()=>{
                this.fireEvent("afterFormCreate")
            },
            failure:err=>{
                this.fireEvent("afterFormCreateError")
            }
        })

        this.formUpdate.save({
            success:()=>{
                this.fireEvent("afterFormUpdate")
            }, 
            failure:()=>{
                this.fireEvent("afterFormUpdateError")
            }
        })

    }

    fireEvent(name, args){

        if(typeof this.options.listeners[name] == 'function'){

            this.options.listeners[name].apply(this, args)

        }

    }

    getTrData(e){

        let tr = e.composedPath().find(el=>{

            return(el.tagName.toUpperCase() == 'TR')

        })

        return JSON.parse(tr.dataset.row)

    }

    btnUpdateClick(e){

        this.fireEvent("beforeUpdateClick", [e])

        let data = this.getTrData(e)

        for(let name in data){

            this.options.onUpdateLoad(this.formUpdate, name, data)
            
        }
        this.fireEvent('afterUpdateClick', [e])
                

    }

    btnDeleteClick(e){

        this.fireEvent("beforeDeleteClick")

        let data = this.getTrData(e)

        if (confirm(eval('`' + this.options.deleteMessage + '`'))) {

            fetch(eval('`' + this.options.deleteUrl + '`'), {
                method: 'DELETE'
            }).then().then(json => {
                this.fireEvent("afterDeleteClick")
                
            })

        }

    }

    initButtons(){

        this.rows.forEach(row =>{

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e=>{

                    if (e.target.classList.contains(this.options.btnUpdate)) {

                        this.btnUpdateClick(e)
                        
                    }
                    else if(e.target.classList.contains(this.options.btnDelete)) {

                        this.btnDeleteClick(e)

                    }
                    else {

                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e])

                    }

                })

            })

        })

    }

}