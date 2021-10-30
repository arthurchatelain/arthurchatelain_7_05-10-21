// definition de la fonction factoring qui créer un bloc quelconque
function creerbloc(type, className, textContent){
    let bloc = document.createElement(type)
    bloc.className = className
    bloc.textContent = textContent
    return bloc
}

// fonction qui transforme un tableau de tableau en un seul tableau (pour unifier des tabeleau de chaine de caracteres)
const oneTab = i => i.join().toString().split(',')

// fonction qui supprime les doublons d'un tableaux 
const supDoublons = item => item.filter( (i, p) => item.indexOf(i) == p )

// fonction qui met en majuscule la première lettre d'une chaîne
const premiereLettreMajuscule = (chaine) => chaine[0].toUpperCase() + chaine.slice(1)

// Fonctions qui affiche/cache un bloc 
const affiche = i => i.style.display = 'flex'
const cacher = i => i.style.display = 'none' 

// Fonctionnalitée qui ouvre le menu de tag pour chaque possibilité de trie

// variable qui contient les 3 blocs appareils ingredients et ustensiles
let possibilitedetrie = Array.from(document.getElementsByClassName('possibilitedetrie'))

// variable qui contient les 3 bloc de recherche, avec la liste et le input 
let recherchetags = Array.from(document.getElementsByClassName('recherchetags'))
let chevronup = Array.from(document.getElementsByClassName('fa-chevron-up'))

// fonction qui gere la fermeture visuelle des champ de recherche avancés
const closeAdvancedResearch = () => {
    Array.from(document.getElementsByClassName('inputtags')).forEach(i => i.value = '')
    possibilitedetrie.forEach(i => affiche(i))
    recherchetags.forEach(i => cacher(i))
}

// Ouverture/fermeture des champs de recherches avancés
for(let i = 0; i < possibilitedetrie.length; i++) {
    possibilitedetrie[i].addEventListener('click', () => {
        closeAdvancedResearch()
        cacher(possibilitedetrie[i])
        affiche(recherchetags[i])
        if(window.innerWidth < 980) possibilitedetrie.forEach(item => cacher(item))
    })
    chevronup[i].addEventListener('click', () => closeAdvancedResearch())
}

// fonction qui organise les tags (suppression des doublons, unn seul tableau, classement par ordre alphabétiqueet travail à effectuer dans recipes)
const orgTag = (item) => supDoublons(oneTab(recipes.map(item))).sort()

// listes des ingrédients des ustensiles et des appareils + tri par ordre alphabétique et suppresion des doubles
let ingredients =  orgTag(i => i.ingredients.map(item => item.ingredient.toLowerCase()))
let ustensiles = orgTag(i => i.ustensils.map(item => item.toLowerCase()))
let appareils = orgTag(i => i.appliance.toLowerCase())

// definition de la fonction createtag permettant de creer des tags (dans les listes)
const createtagforlist = (element, type) => {
    let tagactuel = creerbloc('span', 'tagsinlist' + ' tagsinlist_' + type, premiereLettreMajuscule(element))
    document.getElementById('liste' + type).appendChild(tagactuel)
}

// on créer la liste des tags pour chaque possibilité de trie (dans les listes)
ingredients.forEach(i => createtagforlist(i, 'ingredients'))
appareils.forEach(i => createtagforlist(i, 'appareils'))
ustensiles.forEach(i => createtagforlist(i, 'ustensiles'))

// fonction qui creer un bloc de une recette 
function creerRecettes(id){
    let recette = recipes.find(i => i.id == id) // on prend la recette du bloc que l'on veut créer
    // On creer le bloc de base
    let blocrecette = creerbloc('article', 'blocrecette')
    blocrecette.innerHTML = recetteView
    document.getElementById('main').appendChild(blocrecette)
    let blocDeTravail = document.getElementById('main').lastChild
    // On peut maintenant personnaliser le bloc
    const content = (type, content) => blocDeTravail.getElementsByClassName(type)[0].textContent = content
    content('titrerecette', recette.name)
    content('temps', recette.time + ' min')
    content('description', recette.description)
    // On ajoute enfin les ingrédients
    let blocingredients = blocDeTravail.getElementsByClassName('blocingredients')[0]
    recette.ingredients.forEach(function(item){
        let blocingredient = creerbloc('div', 'texteingredient')
        let ingredient = creerbloc('p', 'ingredient', item.ingredient)
        if(item.quantity == undefined) blocingredient.appendChild(ingredient)
        else if (item.unit == undefined){
            blocingredient.append(ingredient, creerbloc('p', 'ingredientinfo' ,  ' : ' + item.quantity))
        }
        else {
            let quantite = creerbloc('p', 'ingredientinfo' ,  ' : ' + item.quantity + ' ' + item.unit)
            blocingredient.append(ingredient, quantite)
        }
        blocingredients.appendChild(blocingredient)
    })
}

// appel de la fonction par défaut, on creer ainsi tout les blocs recettes
recipes.forEach(item => creerRecettes(item.id))

// création des tags actif (mis en display none, mais peuvent être activvé en display flex)
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
tagsinlist.forEach(function(item){
    item.addEventListener('click', function(){
        affiche(tag.find(element => element.textContent.toLowerCase() == item.textContent.toLowerCase()))
        Array.from(document.getElementsByClassName('inputtags')).forEach(i => i.value = '')
        majKeyWords()
    })
})

// on écoute le clique sur les croix pour fermer les tags actifs 
croixtag.forEach(function(item){
    item.addEventListener('click', function(){
        cacher(item.parentNode)
        majKeyWords()
    })
})

// FONCTIONNALITEES DE RECHERCHES 

// écoute les inputs des 3 bloc de trie avancé

// on récupere les inputs et la liste de tout les tagsinlist
let tagsinlist_ingredients_all = Array.from(document.getElementsByClassName('tagsinlist_ingredients'))
let tagsinlist_appareils_all = Array.from(document.getElementsByClassName('tagsinlist_appareils'))
let tagsinlist_ustensiles_all = Array.from(document.getElementsByClassName('tagsinlist_ustensiles'))
let inputingredients = document.getElementById('barrederechercheingredients')
let inputappareils = document.getElementById('barrederechercheappareil')
let inputustensiles = document.getElementById('barrederechercheustensiles')

// on créer trois variables, qui contiennent par défauts tout les tags in list mais qui se filtreront en fonction des filtres actif
let tagsinlist_ingredients_actif = tagsinlist_ingredients_all
let tagsinlist_appareils_actif = tagsinlist_appareils_all
let tagsinlist_ustensiles_actif = tagsinlist_ustensiles_all

// fonction qui met a jour les listes des tags actif par rapport aux display flex et none des tagslistall
function majListTagActif(){
    tagsinlist_appareils_actif = tagsinlist_appareils_all.filter(i => i.style.display == 'flex')
    tagsinlist_ingredients_actif = tagsinlist_ingredients_all.filter(i => i.style.display == 'flex')
    tagsinlist_ustensiles_actif = tagsinlist_ustensiles_all.filter(i => i.style.display == 'flex')
}

// fonction qui servira à l'écoute des inputs de recherche avancé
const adInput = (input, tags) => tags.forEach((i) => i.textContent.toLowerCase().indexOf(input) == -1 ? cacher(i) : affiche(i)) 

// on écoute
inputingredients.addEventListener('keyup', () => adInput(inputingredients.value.toLowerCase(), tagsinlist_ingredients_actif))
inputappareils.addEventListener('keyup', () => adInput(inputappareils.value.toLowerCase(), tagsinlist_appareils_actif))
inputustensiles.addEventListener('keyup', () => adInput(inputustensiles.value.toLowerCase(), tagsinlist_ustensiles_actif))

// on commence maintenant la vrai recherche et le filtrage par tag 

// on récupere la valeur de linput principal dans une variable
let inputprincipal = document.getElementById('barrederecherche')
let valeurinputprincipal
inputprincipal.addEventListener('keyup', () => {
    valeurinputprincipal = inputprincipal.value
    majKeyWords()
})

// au clic sur entrer dans la barre principale on va sur le main et au clic sur la loupe
inputprincipal.addEventListener('keydown', (e) => e.key == 'Enter' ? window.location = "#main" : e)
document.getElementById('loupesearch').addEventListener('click', () => window.location = "#main")

// on définit une variable qui contiendra tout les keywords dans un tableau
let keywords = []

// on définit une fonction qui mettra à jour ces keywords
function majKeyWords(){
    let keywordsinput = []
    let tagactif = Array.from(document.getElementsByClassName('tagactif'))
    if(valeurinputprincipal != undefined) keywordsinput = valeurinputprincipal.split(' ')
    keywords = tagactif.filter(i => i.style.display == 'flex')
        .map(i => i.textContent.toLowerCase())
        .concat(keywordsinput)
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
let nomrecettesactives = recipes.map(i => i.name.toLowerCase())
let recettesactives = recipes

function majRecettesActives(){
    recettesactives = recipes.filter((item) => {
        let allwords = defAllKeyWords(item.id)
        let keywordscopie = keywords.filter(i => allwords.indexOf(i) != -1)
        keywords.length === keywordscopie.length ? true : false
    })
    nomrecettesactives = recettesactives.map(i => i.name.toLowerCase())
    majRecetteAffichage()
    MajTagsInList()
    majListTagActif()
}

// bloc norecette
const norecette = document.getElementById('norecette')

// Cette fonction met a jour l'affichage des recettes en fonction des noms des recettes actives
function majRecetteAffichage(){
    let blocrecetteact = Array.from(document.getElementsByClassName('blocrecette'))
    blocrecetteact.forEach(function(i){
        cacher(i)
        nomrecettesactives.forEach((el) => {
            if(el == i.getElementsByClassName('titrerecette')[0].textContent.toLowerCase()) i.style.display = 'block'
        })
    })
    blocrecetteact.find(i => i.style.display == "block") == undefined ? affiche(norecette) : cacher(norecette)
}

// Fonction qui affiche ou non un tag
const tagAffiche = (type, i) => type.indexOf(i.textContent.toLowerCase()) == -1 ? cacher(i) : affiche(i)

// Fonction qui appelle tagAffiche() en fonction du type du tag
const tagsVerif = (typeAll, typeActif) => typeAll.forEach(i => tagAffiche(typeActif, i))

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