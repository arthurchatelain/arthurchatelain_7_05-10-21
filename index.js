// definition de la fonction factoring qui créer un bloc quelconque
function creerbloc(type, className, textContent){
    let bloc = document.createElement(type)
    bloc.className = className
    bloc.textContent = textContent
    return bloc
}

// fonction qui met en majuscule la première lettre d'une chaîne 
function premiereLettreMajuscule(chaine)
{
    return chaine[0].toUpperCase() + chaine.slice(1);
}

// fonctionnalité qui ouvre le menu de tag pour chaque possibilité de trie

// variable qui contient les 3 blocs appareils ingredients et ustensiles
let possibilitedetrie = Array.from(document.getElementsByClassName('possibilitedetrie'))
// variable qui contient les 3 bloc de recherche, avec la liste et le input 
let recherchetags = Array.from(document.getElementsByClassName('recherchetags'))

let chevronup = Array.from(document.getElementsByClassName('fa-chevron-up'))
for(let i = 0; i < possibilitedetrie.length; i++) {
    possibilitedetrie[i].addEventListener('click', function(e){
        possibilitedetrie.forEach(function(item){item.style.display = "flex"})
        recherchetags.forEach(function(item){item.style.display = "none"})
        possibilitedetrie[i].style.display = 'none'
        recherchetags[i].style.display = 'flex'
        Array.from(document.getElementsByClassName('tagsinlist')).forEach(function(item){
            item.style.display = 'flex'
        })
    })
    chevronup[i].addEventListener('click', function(e){
        possibilitedetrie[i].style.display = 'flex'
        recherchetags[i].style.display = 'none'
    })
}

// listes des ingrédients des ustensiles et des appareils
let ingredients = []
let ustensiles = []
let appareils = []

recipes.forEach(function(item){
    item.ingredients.forEach(function(element){
        ingredients.push(element.ingredient.toLowerCase())
    })
})
ingredients = ingredients.filter(function(element, position){
    return ingredients.indexOf(element) == position
}).sort()
recipes.forEach(function(item){
    item.ustensils.forEach(function(element){
        ustensiles.push(element.toLowerCase())
    })
})
ustensiles = ustensiles.filter(function(element, position){
    return ustensiles.indexOf(element) == position
}).sort()
recipes.forEach(function(item){
    appareils.push(item.appliance.toLowerCase())
})
appareils = appareils.filter(function(element, position){
    return appareils.indexOf(element) == position
}).sort()

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
recipes.forEach(function(item){
    creerRecettes(item.id)
})

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
tagsinlist.forEach(function(item){
    item.addEventListener('click', function(){
        let tagactu = tag.find(element => element.textContent.toLowerCase() == item.textContent.toLowerCase())
        tagactu.style.display = 'flex'
    })
})

// on écoute le clique sur les croix pour fermer les tags actifs 
croixtag.forEach(function(item){
    item.addEventListener('click', function(){
        item.parentNode.style.display = 'none'
    })
})
