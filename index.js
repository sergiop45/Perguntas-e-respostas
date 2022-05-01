const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const { redirect } = require('express/lib/response');
const Resposta = require("./database/Resposta");

//database

connection.authenticate().then( () => {
    console.log("Conexao realizada com DB");
} ).catch((msgErro) => {
    console.log("erro" + msgErro + "ao tentar conectar");
});



app.set('view engine', 'ejs');
app.use(express.static('public'));

//para usar dados enviados metodo post
app.use(bodyParser.urlencoded({extended:false}));

//mostrar dados da api json
app.use(bodyParser.json());

//pagina principal
app.get("/", function(req, res) {
    //model.findAll() recebe dados da tabela
    Pergunta.findAll({ raw:true, order: [['id','DESC']] }).then((perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    }))

    
});

//pagina com formulario para fazer pergunta

app.get("/perguntar", function(req, res) {
    res.render("perguntar");
});


//recebe dados do formulario

app.post("/salvarpergunta", function (req, res) {
    let title = req.body.titulo;
    let question = req.body.pergunta;
    // nomedomodel.create() inseri dados na  tabela
    Pergunta.create({
        titulo: title,
        descricao: question
    }).then(() => res.redirect("/")).catch(console.log("erro ao tentar salvar questao"));
    
});

//pagina que mostra pergunta selecionada

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({ //findOne localiza um elemento no db
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) { //achou pergunta no Db
            Resposta.findAll({
                where: { perguntaId: pergunta.id},
                order: [['id','DESC']]
            }).then(respostas => {
                res.render("Pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
            
            
        } else { //nao encontrou
            res.redirect("/");
        }
    })
});

app.post("/salvarresposta", (req, res) => {
    let textoresposta = req.body.corpo;
    let idresposta = req.body.perguntaid;
    Resposta.create({
        corpo: textoresposta,
        perguntaId: idresposta
    }).then(() => res.redirect("/")).catch(() => console.log("erro ao tentar salvar resposta"))
})

app.listen(port, function(){
    console.log("servidor rodando")
})