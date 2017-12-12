import {inject} from 'aurelia-framework';
import {DataServices} from './data-services';

@inject(DataServices)
export class Todos {

    constructor(data) {
		this.data = data;
		
		this.TODO_SERVICE = 'todos';
		this.todosArray = [];
    }

    async save(todo){
        if(todo){
			if(!todo._id){
				let response = await this.data.post(todo, this.TODO_SERVICE);
				if(!response.error){
					this.todosArray.push(response);
				}
				return response;
			} else {
				let response = await this.data.put(todo, this.TODO_SERVICE + "/" + todo._id);
				if(!response.error){
				}
				return response;
			}

        }
	}

	uploadFile(files, user, todo){
       	this.data.uploadFiles(files, this.TODO_SERVICE + "/upload/" + user + '/' + todo);
    }

	async deleteTodo(id){
		let response = await this.data.delete(this.TODO_SERVICE + "/" + id);
		if(!response.error){
			for(let i = 0; i < this.todosArray.length; i++){
				if(this.todosArray[i]._id === id){
					this.todosArray.splice(i,1);
				}
			}
		}
	}
	
	async getUserTodos(id){
		let response = await this.data.get(this.TODO_SERVICE + "/user/" + id);
		if(!response.error){
			this.todosArray = response;
		}
	}

}
