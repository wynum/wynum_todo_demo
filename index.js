const app = new Vue({
  el: "#app",
  data: {
    action: "login",
    email: "",
    password: "",
    token: "",
    apiToken: 8846051,
    isLoggedIn: false,
    showCodeCard: false,
    todos: [],
    description: '',
    code: '',
  },

  methods: {
    addTodo() {
      let todo = {
        'id': this.makeid(5),
        'description': this.description,
        'timestamp': `${+ new Date()}`,
        'completed': "no",
        'user_email': this.email
      }
      // this.todos.push(todo)
      this.todos.splice(0, 0, todo)
      this.description = ""

      let url = `https://api.wynum.com/postStage/35503437d86007c4c5876341439119dc?token=${this.token}`
      let config = { headers: { "Content-Type": "application/json" } }
      axios.post(url, JSON.stringify(todo), config).then((res) => {
        console.log(res.data)
      })
    },

    removeTodo(index) {
      let todoId = this.todos[index].id
      this.todos.splice(index, 1)
      let url = `https://api.wynum.com/deleteStage/3da33ecbb1f0b8edf7a218ce460e3bc0?token=${this.token}`
      let data = JSON.stringify({"id": `${todoId}`})
      console.log(data)
      axios.delete(url, {data: data,  headers: { "Content-Type": "application/json" }}).then((res) => {
        console.log(res.data)
      })
    },

    getTodos() {
      let url = `https://api.wynum.com/getallStage/71f71ac6b3200cdd83ef34725b9aa501?user_email=${this.email}&token=${this.token}`
      axios.get(url).then((res) => {
        console.log(res.data)
        this.todos = res.data;
      })
    },

    login() {
      let url = `https://api.wynum.com/loginapi?username=${this.email}&password=${this.password}`

      axios.post(url).then((res) => {
        console.log(res.data)
        let data = res.data
        if (data['Token']) {
          this.token = data['Token']
          this.addProject()
          // this.getTodos()
          this.isLoggedIn = true
          return
        }

        if (data['value'] == 0) {
          this.showCodeCard = true
          return
        }

        if (data['error'] == 'Email not confirmed') {
          this.showCodeCard = true
          return;
        }
      })
    },

    confirmCode() {
      let url = `https://api.wynum.com/confirmapicode?code=${this.code}`
      axios.post(url).then((res) => {
        console.log(res.data)
        let data = res.data
        console.log(data['Token'])
        if (data['Token']) {
          this.token = data['Token']
          this.addProject()
          this.isLoggedIn = true
        }
      })
    },

    addProject() {
      let url = `https://api.wynum.com/authapitoken?apitoken=${this.apiToken}&token=${this.token}`
      axios.post(url).then((res) => {
        console.log(res.data)
        this.getTodos()
      })
    },

    makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  }
})