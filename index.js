// fonctionnalité qui ouvre le menu de tag pour chaque possibilité de trie
let possibilitedetrie = Array.from(document.getElementsByClassName('possibilitedetrie'))
let recherchetags = Array.from(document.getElementsByClassName('recherchetags'))
let chevronup = Array.from(document.getElementsByClassName('fa-chevron-up'))
for(let i = 0; i < possibilitedetrie.length; i++) {
    possibilitedetrie[i].addEventListener('click', function(e){
        possibilitedetrie.forEach(function(item){item.style.display = "flex"})
        recherchetags.forEach(function(item){item.style.display = "none"})
        possibilitedetrie[i].style.display = 'none'
        recherchetags[i].style.display = 'flex'
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

// fonction qui met en majuscule la première lettre d'une chaîne 
function premiereLettreMajuscule(chaine)
{
    return chaine[0].toUpperCase() + chaine.slice(1);
}

// definition de la fonction factoring qui créer un bloc quelconque
function creerbloc(type, className, textContent){
    let bloc = document.createElement(type)
    bloc.className = className
    bloc.textContent = textContent
    return bloc
}

// definition de la fonction createtag permettant de creer des tags 
function createtagforlist(element){
    return creerbloc('span', 'tagsinlist', premiereLettreMajuscule(element))
}

// on créer la liste des tags pour chaque possibilité de trie 
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
// variables qui contient les tags actuellement actifs et les croix de ceux-ci 
let tagsactifs = []
let croixtag = []

// définition de la fonction qui crée un tag actif
function createtagactif(keyword, classe){
    // on test si il n'y aurait pas déjà le même tag d'activé
    if(tagsactifs.find(element => element == keyword) == undefined){
        tagsactifs.push(keyword)
        return creerbloc('span', classe, keyword)
    }
}

// variable a écouter pour définit les tags actifs
let tagsinlist = Array.from(document.getElementsByClassName('tagsinlist'))

// on écoute le clique sur un des tags dans la liste
tagsinlist.forEach(function(item){
    item.addEventListener('click', function(){
        // on creer le tag
        let tag = createtagactif(item.textContent, 'tagactif ' + item.classList[1].replace('tagsinlist', 'tagactif'))
        let croix = creerbloc('img', 'croixtag')
        croix.src = './croixtag.png'
        tag.appendChild(croix)
        document.getElementById('listetagsactifs').appendChild(tag)
        // on met a jour la variable d'écoute pour les croix des tags actifs et on écoute les click sur ces croix
        croixtag = Array.from(document.getElementsByClassName('croixtag'))
        croixtag.forEach(function(item){
            item.addEventListener('click', function(e){
                item.parentNode.remove()
                tagsactifs.splice(tagsactifs.indexOf(item.textContent), 1)
            })
        })
    })
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

recipes.forEach(function(item){
    creerRecettes(item.id)
})

