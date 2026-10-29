const express = require("express")
const mysql = require("mysql2/promise")
const app = express()

app.use(express.json())
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jogos",
    waitForConnections: true
})

// ======== rota dos generos ========

// adicionar            FUNCIONANDO
app.post("/generos", async (req, res) => {
    const {nome, descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json({error: "Nome e descrição são obrigatórios"})
    }
    const[resultado] = await db.execute("INSERT INTO genero (nome, descricao) VALUES (?, ?)", [nome, descricao])
    return res.status(201).json({id: resultado.insertId, nome, descricao})
})

// listar               FUNCIONANDO
app.get("/generos", async (req, res) => {
    const [generos] = await db.execute("SELECT * FROM genero")
    return res.json(generos)
})

//======== rota dos jogos ======== 

// adicionar                FUNCIONANDO (depois de muita sofrência T-T)
app.post('/jogos' , async (req, res)=>{
    const {nome, desenvolvedora, sinopse, genero_id} = req.body
    if (!nome || !desenvolvedora || !sinopse || !genero_id){
        return res.status(400).json({error: 'Nome, desenvolvedora, sinopse e o id do gênero são obrigatórios.'})
    }
    const [result] = await db.execute('INSERT INTO jogos (nome, desenvolvedora, sinopse, id_genero) VALUES(?, ?, ?, ?)',[nome, desenvolvedora, sinopse, genero_id])
    return res.status(201).json({id:result.insertId, nome, desenvolvedora, sinopse, genero_id})
    
})

// listar                      FUNCIONANDO
app.get("/jogos", async (req, res) => {
    const [jogos] = await db.execute("SELECT * FROM jogos")
    return res.json(jogos)
})

// procurar pelo id    DESAFIO          FUNCIONANDO (também problema de "_j")
app.get("/jogos/:id", async (req, res) => {
    const id = req.params.id
    const [jogos] = await db.execute("SELECT * FROM jogos WHERE id_j = ?", [id])
    
    // caso NÂO exista
    if(jogos.length === 0){
        return res.status(404).json({error:"O jogo não foi encontrado."})
    }
    // se existir
    return res.json(jogos[0])
})

// atualizar informacoes        FUNCIONANDO (o problema era a falta de um "_j" kkkkkkkk)
app.put("/jogos/:id", async (req, res) =>{
    const {genero_id, nome, desenvolvedora, sinopse} = req.body
    const id = req.params.id
    
    //se não houver dados suficientes
    if(!genero_id || !nome || !desenvolvedora || !sinopse){
        return res.status(400).json({error: "O genero, o nome, a desenvolvedora e a sinopse são obrigatórios!"})
    }    
    
    
    const [resultado] = await db.execute("SELECT * FROM jogos WHERE id_j = ?", [id])

    // se não houver 
    if(resultado.length === 0){
        return res.status(404).json({error: "O jogo não foi encontrado."})
    }

    // se existir
    await db.execute("UPDATE jogos SET id_genero = ?, nome = ?, desenvolvedora = ?, sinopse = ? WHERE id_j = ?", [genero_id, nome, desenvolvedora, sinopse, id])

    return res.status(201).json({id, genero_id, nome, desenvolvedora, sinopse})

})

// apagar algum jogo        FUNCIONANDO (também esqueci de colocar o "_j" depois do id)
app.delete("/jogos/:id", async (req, res) => {
    const id = req.params.id

    const [resultado] = await db.execute("DELETE FROM jogos WHERE id_j = ?", [id])

    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "O jogo não foi encontrado."})
    }
    res.status(200).json({mensagem: "Jogo deletado com sucesso!"})
})

app.listen(3000, () => console.log("API rodando"))