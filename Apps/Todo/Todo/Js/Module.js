import BaseModule from '/Core/Base/BaseModule'
import ListComponent from '/Apps/Todo/Todo/Js/Components/TaskList/TaskList'
import FormComponent from '/Apps/Todo/Todo/Js/Components/TaskForm/TaskForm'
import TasksStore from '/Apps/Todo/Todo/Js/Stores/TasksStore'

class Todo extends BaseModule {

	registerRoutes() {

		return {
			'/Todo/Todo': {
				MainContent: {
					component: ListComponent.createComponent(),
					props: {
						saveState: true
					}
				}
			},
			'/Todo/Todo/:id': {
				MainContent: {
					component: FormComponent.createComponent()
				}
			}
		}
	}

	registerStores() {
		return [
			TasksStore
		];
	}
}

export default Todo;