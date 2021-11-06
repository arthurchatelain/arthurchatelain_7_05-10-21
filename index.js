// definition de la fonction factoring qui créer un bloc quelconque
function creerbloc(type, className, textContent){
    let bloc = document.createElement(type)
    bloc.className = className
    bloc.textContent = textContent
    return bloc
}

// fonction qui met en majuscule la première lettre d'une chaîne 
const premiereLettreMajuscule = (chaine) => chaine[0].toUpperCase() + chaine.slice(1)

// fonctionnalité qui ouvre le menu de tag pour chaque possibilité de trie

// variable qui contient les 3 blocs appareils ingredients et ustensiles
let possibilitedetrie = Array.from(document.getElementsByClassName('possibilitedetrie'))

// variable qui contient les 3 bloc de recherche, avec la liste et le input 
let recherchetags = Array.from(document.getElementsByClassName('recherchetags'))
let chevronup = Array.from(document.getElementsByClassName('fa-chevron-up'))

for(let i = 0; i < possibilitedetrie.length; i++) {
    possibilitedetrie[i].addEventListener('click', function(e){
        // cette ligne met la valeurs de tout les input avance a vide
        Array.from(document.getElementsByClassName('inputtags')).forEach(item => item.value = '')
        possibilitedetrie.forEach(item => item.style.display = "flex")
        recherchetags.forEach(item => item.style.display = "none")
        possibilitedetrie[i].style.display = 'none'
        recherchetags[i].style.display = 'flex'
        if(window.innerWidth < 980) possibilitedetrie.forEach(item => item.style.display = "none")
    })
    chevronup[i].addEventListener('click', function(e){
        // cette ligne met la valeurs de tout les input avance a vide
        Array.from(document.getElementsByClassName('inputtags')).forEach(item => item.value = '')
        possibilitedetrie.forEach(item => item.style.display = "flex")
        recherchetags.forEach(item => item.style.display = "none")
    })
}

// listes des ingrédients des ustensiles et des appareils + tri par ordre alphabétique et suppresion des doubles
let ingredients = []
let ustensiles = []
let appareils = []

const each = (tableau, fonction) => {
    for(let i = 0; i < tableau.length; i++){
        fonction(tableau[i], i)
    }
}

each(recipes, (item) => {
    item.ingredients.forEach(element => ingredients.push(element.ingredient.toLowerCase()))
    item.ustensils.forEach(element => ustensiles.push(element.toLowerCase()))
    appareils.push(item.appliance.toLowerCase())
})

const supDoublons = (tableau) => {
    let filteredTab = []
    for (let i = 0; i < tableau.length; i++) {
        if (tableau.indexOf(tableau[i]) === i) {
            filteredTab.push(tableau[i])
        }
    }
    return filteredTab.sort()
}

ingredients = supDoublons(ingredients)
ustensiles = supDoublons(ustensiles)
appareils = supDoublons(appareils)

// definition de la fonction createtag permettant de creer des tags (dans les listes)
function createtagforlist(element){
    return creerbloc('span', 'tagsinlist', premiereLettreMajuscule(element))
}

// on créer la liste des tags pour chaque possibilité de trie (dans les listes)
ingredients.forEach(function(item){
    let tagactuel = createtagforlist(item)
    tagactuel.className += ' tagsinlist_ingredients'
    document.getElementById('listeingredients').appendChild(tagactuel)
})

appareils.forEach(function(item){
    let tagactuel = createtagforlist(item)
    tagactuel.className += ' tagsinlist_appareils'
    document.getElementById('listeappareils').appendChild(tagactuel)
})

ustensiles.forEach(function(item){
    let tagactuel = createtagforlist(item)
    tagactuel.className += ' tagsinlist_ustensiles'
    document.getElementById('listeustensiles').appendChild(tagactuel)
})

// fonction qui creer un bloc de une recette 
function creerRecettes(id){
    let recette = recipes[id - 1];
    let blocrecette = creerbloc('article', 'blocrecette')
    let imagegrise = creerbloc('div', 'imagegrise')
    let recettedescription = creerbloc('section', 'recettedescription')
    let presentation = creerbloc('section', 'presentation')
    let titre = creerbloc('h2', 'titrerecette', recette.name)
    let divtemps = creerbloc('div', 'divtemps')
    let horloge = creerbloc('img', 'horloge')
    horloge.src = './horloge.png'
    let temps = creerbloc('p', 'temps', recette.time + ' min')
    divtemps.append(horloge, temps)
    presentation.append(titre, divtemps)
    let blocdescription = creerbloc('section', 'blocdescription')
    let blocingredients = creerbloc('div', 'blocingredients')
    recette.ingredients.forEach(function(item){
        let ingredient
        let quantite
        let blocingredient = creerbloc('div', 'texteingredient')
        if(item.quantity == undefined && item.unit == undefined) {
            ingredient = creerbloc('p', 'ingredient', item.ingredient)
            blocingredient.appendChild(ingredient)
        }
        else if (item.quantity != undefined && item.unit == undefined){
            ingredient = creerbloc('p', 'ingredient', item.ingredient)
            quantite = creerbloc('p', 'ingredientinfo' ,  ' : ' + item.quantity)
            blocingredient.append(ingredient, quantite)
        }
        else {
            ingredient = creerbloc('p', 'ingredient', item.ingredient)
            quantite = creerbloc('p', 'ingredientinfo' ,  ' : ' + item.quantity + ' ' + item.unit)
            blocingredient.append(ingredient, quantite)
        }
        blocingredients.appendChild(blocingredient)
    })
    let description = creerbloc('p', 'description', recette.description)
    blocdescription.append(blocingredients, description)
    recettedescription.append(presentation, blocdescription)
    blocrecette.append(imagegrise, recettedescription)
    document.getElementById('main').appendChild(blocrecette)
}

// appel de la fonction par défaut, on creer ainsi tout les blocs recettes
recipes.forEach(item => creerRecettes(item.id))

// crétaion des tags actif (mis en display none, mais peuvent être activvé en display flex)
Array.from(document.getElementsByClassName('tagsinlist')).forEach(function(item){
    let tag = creerbloc('span', 'tagactif ' + item.classList[1].replace('tagsinlist', 'tagactif'), item.textContent)
    let croix = creerbloc('img', 'croixtag')
    croix.src = './croixtag.png'
    tag.appendChild(croix)
    document.getElementById('listetagsactifs').appendChild(tag)
})

// variables qui contient les tags actuellement actifs et les croix de ceux-ci 
let tag = Array.from(document.getElementsByClassName('tagactif'))
let croixtag = Array.from(document.getElementsByClassName('croixtag'))

// variable a écouter pour définir les tags actifs (ce sont les tags des listes sur lesquels on clique)
let tagsinlist = Array.from(document.getElementsByClassName('tagsinlist'))

// on écoute le clique sur un des tags dans la liste pour activer le tag correspondant
each(tagsinlist, (item) => {
    item.addEventListener('click', function(){
        let tagactu = tag.find(element => element.textContent.toLowerCase() == item.textContent.toLowerCase())
        tagactu.style.display = 'flex'
        Array.from(document.getElementsByClassName('inputtags')).forEach(item => item.value = '')
        majKeyWords()
    })
})

// on écoute le clique sur les croix pour fermer les tags actifs
each(croixtag, (item) => {
   item.addEventListener('click', function(){
        item.parentNode.style.display = 'none'
        majKeyWords()
    }) 
})

// FONCTIONNALITEES DE RECHERCHES 

// écoute les inputs des 3 bloc de trie avancé

// on créer trois variables, qui contiennent par défauts tout les tags in list mais qui se filtreront en fonction des filtres actif
let tagsinlist_ingredients_actif = Array.from(document.getElementsByClassName('tagsinlist_ingredients'))
let tagsinlist_appareils_actif = Array.from(document.getElementsByClassName('tagsinlist_appareils'))
let tagsinlist_ustensiles_actif = Array.from(document.getElementsByClassName('tagsinlist_ustensiles'))

// on récupere les inputs et la liste de tout les tagsinlist
let tagsinlist_ingredients_all = Array.from(document.getElementsByClassName('tagsinlist_ingredients'))
let tagsinlist_appareils_all = Array.from(document.getElementsByClassName('tagsinlist_appareils'))
let tagsinlist_ustensiles_all = Array.from(document.getElementsByClassName('tagsinlist_ustensiles'))
let inputingredients = document.getElementById('barrederechercheingredients')
let inputappareils = document.getElementById('barrederechercheappareil')
let inputustensiles = document.getElementById('barrederechercheustensiles')

// fonction qui met a jour les listes des tags actif par rapport aux display flex et none des tagslistall
function majListTagActif(){
    tagsinlist_appareils_actif = []
    tagsinlist_ingredients_actif = []
    tagsinlist_ustensiles_actif = []
    for (let i = 0; i < tagsinlist_appareils_all.length; i++){
        let item = tagsinlist_appareils_all[i]
        if(item.style.display == 'flex') tagsinlist_appareils_actif.push(item)
    }
    for (let i = 0; i < tagsinlist_ingredients_all.length; i++){
        let item = tagsinlist_ingredients_all[i]
        if(item.style.display == 'flex') tagsinlist_ingredients_actif.push(item)
    }
    for (let i = 0; i < tagsinlist_ustensiles_all.length; i++){
        let item = tagsinlist_ustensiles_all[i]
        if(item.style.display == 'flex') tagsinlist_ustensiles_actif.push(item)
    }
}

// on écoute
inputingredients.addEventListener('keyup', function(){
    let valeur = inputingredients.value
    tagsinlist_ingredients_actif.forEach(function(item){
        if(item.textContent.toLowerCase().indexOf(valeur.toLowerCase()) == -1){
            item.style.display = 'none'
        }
        else item.style.display = 'flex'
    })
})
inputappareils.addEventListener('keyup', function(){
    let valeur = inputappareils.value
    tagsinlist_appareils_actif.forEach(function(item){
        if(item.textContent.toLowerCase().indexOf(valeur.toLowerCase()) == -1){
            item.style.display = 'none'
        }
        else item.style.display = 'flex'
    })
})
inputustensiles.addEventListener('keyup', function(){
    let valeur = inputustensiles.value
    tagsinlist_ustensiles_actif.forEach(function(item){
        if(item.textContent.toLowerCase().indexOf(valeur.toLowerCase()) == -1){
            item.style.display = 'none'
        }
        else item.style.display = 'flex'
    })
})

// on commence maintenant la vrai recherche et le filtrage par tag 

// on récupere la valeur de linput principal dans une variable
let inputprincipal = document.getElementById('barrederecherche')
let valeurinputprincipal
inputprincipal.addEventListener('keyup', function(){
    valeurinputprincipal = inputprincipal.value
    majKeyWords()
})

// au clic sur entrer dans la barre principale on va sur le main et au clic sur la loupe
document.getElementById('barrederecherche').addEventListener('keydown', function(e){
    if(e.key == 'Enter'){
        e.preventDefault()
        e.stopPropagation()
        window.location = "#main"
    }
})

document.getElementById('loupesearch').addEventListener('click', e => window.location = "#main")

// on définit une variable qui contiendra tout les keywords dans un tableau
let keywords = []

// on définit une fonction qui mettra à jour ces keywords
function majKeyWords(){
    keywords = []
    let tagactif = Array.from(document.getElementsByClassName('tagactif'))
    each(tagactif, (item) => {
        if(item.style.display == 'flex'){
            keywords.push(item.textContent.toLowerCase())
        }
    })
    if(valeurinputprincipal != '' && valeurinputprincipal != undefined){
        let keywordsinput = valeurinputprincipal.split(' ')
        each(keywordsinput, (item) => {
            keywords.push(item.toLowerCase())
        })
    }
    majRecettesActives()
}

// Ensuite il faut définir les recettes encore actives apres la modification des keywords
// Pour cela il faut comparer els allwords (tout les mots clé) chaque recette avec tout les mots clés activé 

// on définit une fonction qui prend en paramètre l'id d'une recette et qui renverra le allkeywords de la recette 
function defAllKeyWords(number){
    let recipe = recipes.find(i => i.id == number)
    return recipe.ingredients
        .map(i => i.ingredient)
        .concat(recipe.ustensils, recipe.name, recipe.description, recipe.appliance)
        .join(' ')
        .toLowerCase()
}

// On va ensuite comparer les allwords de chaque recette avec les keywords et mettre les recettes encore actives dans une variable 
// par défaut la variable vaut toute les recettes puisque de base toutes les recettes sont actives 
let nomrecettesactives = []
let recettesactives = recipes
each(recipes, (item) => nomrecettesactives.push(item.name.toLowerCase()))

function majRecettesActives(){
    nomrecettesactives = []
    recettesactives = []
    each(recipes, function(item){
        let allwords = defAllKeyWords(item.id)
        let verif = 0
        let verifbis = 0
        each(keywords, function(element){
            allwords.indexOf(element) != -1 ? verif++ : verif = verif
            verifbis++
        })
        if(verif == verifbis){
            nomrecettesactives.push(item.name.toLowerCase())
            recettesactives.push(item)
        }
    })
    majRecetteAffichage()
    MajTagsInList()
    majListTagActif()
}

// Cette fonction met a jour l'affichage des recettes en fonction des noms des recettes actives
function majRecetteAffichage(){
    each(Array.from(document.getElementsByClassName('blocrecette')), function(item){
        item.style.display = 'none'
        each(nomrecettesactives, function(element){
            if(element.toLowerCase() == item.lastChild.firstChild.firstChild.textContent.toLowerCase()){
                item.style.display = 'block'
            }
        })
    })
    if(Array.from(document.getElementsByClassName('blocrecette')).find(i => is.style.display == "block") == undefined){
        document.getElementById('norecette').style.display = 'flex'
    }
    else document.getElementById('norecette').style.display = 'none'
}

// Fonction qui affiche ou non un tag
function tagAffiche (typeActif, item) {
    typeActif.indexOf(item.textContent.toLowerCase()) == -1 ? item.style.display = 'none' : item.style.display = 'flex'
}

// Fonction qui appelle tagAffiche() en fonction du type du tag
function tagsVerif(typeTagsAll, typeTagsActif) {
    each(typeTagsAll, function(item){
        tagAffiche(typeTagsActif, item)
    })
}

// fonction qui transforme un tableau de tableau en un seul tableau (pour unifier des tabeleau de chaine de caracteres)
function oneTab (item){
    return item.join().toString().split(',')
}

// On creer aussi une fonction qui met a jour les tagsinlist 
function MajTagsInList(){
    // on creer les tableaux contenant les tags actifs
    let ingredientsactif = oneTab(recettesactives.map(i => i.ingredients.map(i => i.ingredient.toLowerCase())))
    let appareilsactif = recettesactives.map(i => i.appliance.toLowerCase())
    let ustensilesactif = oneTab(recettesactives.map(i => i.ustensils.map(i => i.toLowerCase())))
    // on met a jour visuellement les tags
    tagsVerif(tagsinlist_appareils_all, appareilsactif)
    tagsVerif(tagsinlist_ingredients_all, ingredientsactif)
    tagsVerif(tagsinlist_ustensiles_all, ustensilesactif)
}