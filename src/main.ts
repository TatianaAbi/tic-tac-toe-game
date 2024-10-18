const startButton = document.querySelector("#start");
const loadButton = document.querySelector("#load-game")

const menu = document.querySelector(".menu")
const create = document.querySelector(".create")

const viewLoad = document.querySelector(".load")
const game = document.querySelector(".game")
const winnerView = document.querySelector(".winner") as  HTMLElement
const loadSaves = document.querySelector(".load-saves") as HTMLElement

const inputCol= document.querySelector("#height-map") as HTMLInputElement
const inputRow = document.querySelector("#wide-map") as HTMLInputElement
const inputGroup = document.querySelector("#group-map") as HTMLInputElement


const createStart= document.querySelector("#start-game")

const player = document.querySelector(".game-name") as HTMLElement
const textWinner = document.querySelector(".text-winner") as HTMLElement

const map = document.querySelector(".game_container") as HTMLInputElement
const reiniciar = document.querySelector(".reiniciar") as HTMLButtonElement

let firstgamer = true
let matrizActual:string[][]= []

startButton?.addEventListener('click',()=>{
  menu?.classList.add("inactive")
  create?.classList.remove("inactive")
})
loadButton?.addEventListener('click',()=>{
  menu?.classList.add("inactive")
  viewLoad?.classList.remove("inactive")
  if(localStorage.length > 0){
    Object.keys(localStorage).forEach((clave:string)=>{
    const article = document.createElement("article")
    article.textContent = clave
    article.classList.add('item')
    loadSaves.append(article)

    article.onclick = ()=> loadGame(clave)
  })
  }
  
})
reiniciar.addEventListener('click',()=>{
  winnerView.classList.add("inactive")
   const matriz = createMap(inputCol.value,inputRow.value)
   renderMap(matriz,firstgamer)
})

createStart?.addEventListener("click",startGame)
window.addEventListener("keydown",eventBoards)

function handle(rowId:number,colId:number,matriz:string[][],jugador:boolean){
  let ficha = jugador ? "⚫" : "⚪"
  if(matriz[rowId][colId] === " "){
    matriz[rowId][colId] = ficha
    jugador = !jugador
    renderMap(matriz,jugador)
    matrizActual = matriz
  }
  player.innerHTML = `turno: [${jugador ? "⚫":"⚪"}]`
}
function eventBoards(event:KeyboardEvent){
  if(event.key.toLowerCase() === "x"){
    window.location.reload()
  }
  if(event.key.toLowerCase() == "s"){
    if(matrizActual.length > 0 ){
      let name = prompt("el nombre del guardado es")
      if(name){
        saveGame(name,matrizActual)
      }  
    }else{
      alert("no hay nada que guardar en este mapa")
    }
  }
}
function createMap(col:string,row:string){
  const newArray:string[][]=[]
  
  for (let i = 0; i < parseInt(row) ; i++) {
    let interArray:string[] = []
    if(interArray) newArray.push(interArray)
    for (let e = 0; e < parseInt(col); e++) {
      interArray.push(" ")
    }
  }
  return newArray
}
function renderMap(matriz:string[][],jugador:boolean,group?:number){
  map.innerHTML = ""

   matriz.forEach((row,i)=>{
     const divRow = document.createElement("div")
     divRow.className = "columnas"
     row.forEach((col,e)=>{
        const divCol = document.createElement("div");
        const p = document.createElement("p");
        divCol.classList.add("container-ficha")
        p.className = "casilla";
        p.textContent = col
        divCol.addEventListener('click',()=>{
           handle(i,e,matriz,jugador)
        })

        divCol.append(p)
        divRow.append(divCol)
     })
     map?.append(divRow)
   })
   //horizontal
   for (let i = 0; i < matriz.length; i++) {
    let contadorHorizontal = 1;
    for (let e = 0; e < matriz[i].length; e++) {
      const next = e + 1 > matriz[i].length -1 ? undefined : e + 1
         if(next !== undefined ){
          if (matriz[i][e] === matriz[i][next] && matriz[i][e] !== " ") { 
            ++contadorHorizontal;
            if (contadorHorizontal == parseInt(inputGroup.value)) {
                youWin(jugador)
            }
          }else{
            contadorHorizontal = 1
          }
         }  
    }
    }  
   //vertical
   for (let i = 0; i < matriz[0].length; i++) {
      let contadorVertical = 0
      let down = i + 1 < matriz[0].length - 1 ? i + 1 : i -1
      for (let e = 0; e < matriz.length; e++) {
        if(matriz[e][i] == matriz[down][i] && matriz[e][i] !== " "){
            ++contadorVertical
            if(contadorVertical == parseInt(inputGroup.value)){
              youWin(jugador)
            }
        }else{
          contadorVertical = 0
        }
      }

    }
    //diagonal
   for (let i = 0; i < matriz[0].length; i++) {
    let countUp = 1
   for (let e = 0; e < matriz.length -1; e++) {
       const next = i + e
       if(next < matriz[0].length -1 ){
         if(matriz[e][next] === matriz[e + 1][next + 1] && matriz[e][next] !== " "){
            ++countUp
            if(countUp == parseInt(inputGroup.value)){
              youWin(jugador)
            }  
         }else{ countUp = 1 }
       }
    }
   }

   for (let i = 0; i < matriz[0].length; i++) {
    let contador = 1
   for (let e = 0; e < matriz.length -1; e++) {
       const col = matriz.length - 1 - e
       const next = matriz[0].length - 1 - e - i;
       const colLess = col -1
       const nextLess = next - 1 
       if(col >= 0 && next >= 0 && colLess >= 0 && nextLess >= 0){
           if(matriz[col][next] === matriz[colLess][nextLess] && matriz[col][next] !== " "){
            ++contador
            if(contador == parseInt(inputGroup.value)){
              youWin(jugador)
            }  
           }else{ contador = 1}
        }
    }
   }

   for (let i = 0; i < matriz[0].length; i++) {
      let contador = 1
       for (let e = 0; e < matriz.length; e++) {
        const next = matriz[0].length - i - e
        const colLess = e - 1
        const nextLess = next + 1
         if(next >= 0 && next < matriz[0].length && colLess >= 0 && nextLess>= 0){
           if(matriz[e][next] !== " " && matriz[e][next] !== undefined){
             if(matriz[e][next] === matriz[colLess][nextLess]){
              ++contador
               console.log(contador)
               if(contador == parseInt(inputGroup.value)){
                  youWin(jugador)
               }
             }else{
              contador = 1
             }
           }
          }
       }  
   }
   for (let i = 0; i < matriz[0].length; i++) {
      let contador = 1
       for (let e = 0; e < matriz.length; e++) {
        const col = matriz.length - 1 - e
        const next = e + i
        const nextLess = next + 1
        const colLess = col - 1
         if(col >= 0 && colLess >= 0  && nextLess < matriz[0].length){
           if(matriz[col][next] !== " " && matriz[col][next] !== undefined){
             if(matriz[col][next] === matriz[colLess][nextLess]){
              ++contador
               console.log(contador)
               if(contador == parseInt(inputGroup.value)){
                  youWin(jugador)
               }
             }else{
              contador = 1
             }
           }
          }
       }  
  }
}
function startGame(){
  create?.classList.add("inactive")
  game?.classList.remove("inactive")

  const mapMatriz = createMap(inputCol.value,inputRow.value)
  const quantity = parseInt(inputGroup.value)
  renderMap(mapMatriz,firstgamer,quantity)

}
function youWin(jugador:boolean){
  let ficha = jugador ? "⚪":"⚫"
  winnerView.classList.remove("inactive")
  textWinner.innerHTML = `felicidades tu ganaste [${ficha}]`
  
}
function saveGame(name:string,matriz:string[][]){
  localStorage.setItem(name,JSON.stringify(matriz))
}

function loadGame(clave:string){
  console.log(clave)
  const matriz = localStorage.getItem(clave)
  if(typeof matriz == "string"){
    const newMatriz:string[][] = JSON.parse(matriz)
    renderMap(newMatriz,firstgamer)
    viewLoad?.classList.add("inactive")
    game?.classList.remove("inactive")
  }
}