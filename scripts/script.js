/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

//  Cette fonction affiche sur la page HTML le score de l'utilisateur plutôt que dans la console
function afficherResultat(score, nbMotsProposes) {
    // Récupération de la zone dans laquelle on va écrire le score
    let spanScore = document.querySelector(".zoneScore span");
    // Ecriture du texte
    let affichageScore = `${score} / ${nbMotsProposes}`;
    // On place le texte à l'intérieur du span
    spanScore.innerText = affichageScore;
}

/**
 * Cette fonction affiche une proposition, que le joueur devra recopier, 
 * dans la zone "zoneProposition"
 */
function afficherProposition(proposition) {
    let zoneProposition = document.querySelector(".zoneProposition");
    zoneProposition.innerText = proposition;
}

/**
 * Cette fonction construit et affiche l'email. 
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`;
    location.href = mailto;
}

/**
 * Cette fonction prend un nom en paramètre et valide qu'il est au bon format
 * ici : deux caractères au minimum
 */
function validerNom(nom) {
    if (nom.length < 2) {
        throw new Error("Le nom est trop court");
    }
}

/**
 * Cette fonction prend un email en paramètre et valide qu'il est au bon format. 
 */
function validerEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (!emailRegExp.test(email)) {
        throw new Error("L'email n'est pas valide")
    }
}

/**
 * Cette fonction affiche le message d'erreur passé en paramètre. 
 * Si le span existe déjà, alors il est réutilisé pour ne pas multiplier
 * les messages d'erreurs.
 */
function afficherMessageErreur(message) {
    let spanErreurMessage = document.getElementById("erreurMessage");
    if (!spanErreurMessage) {
        let popup = document.querySelector(".popup");
        spanErreurMessage = document.createElement("span");
        spanErreurMessage.id = "erreurMessage";

        popup.append(spanErreurMessage);
    }
    spanErreurMessage.innerText = message;
}

/**
 * Cette fonction permet de récupérer les informations dans le formulaire
 * de la popup de partage et d'appeler l'affichage de l'email avec les bons paramètres.
 */
function gererFormulaire(scoreEmail) {
    try {
        let baliseNom = document.getElementById("nom");
        let nom = baliseNom.value;
        validerNom(nom);

        let baliseEmail = document.getElementById("email");
        let email = baliseEmail.value;
        validerEmail(email);
        afficherMessageErreur("");
        afficherEmail(nom, email, scoreEmail);

    } catch(erreur) {
        afficherMessageErreur(erreur.message);
    }
}

// Cette fonction lance le jeu. 
// Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
function lancerJeu () {
    initAddEventListenerPopup();

    let score = 0;
    // variable qui servira de compteur, remplace nbMotsProposes
    let i = 0;
    let listeProposition = listeMots;

    let btnValiderMot = document.getElementById("btnValiderMot");
    let inputEcriture = document.getElementById("inputEcriture");
    afficherProposition(listeProposition[i]);

    // Gestion de l'événement click sur le bouton "valider"
    btnValiderMot.addEventListener("click", () => {
        if (inputEcriture.value === listeProposition[i]) {
            score++;
        }
        i++;
        afficherResultat(score, i);

        inputEcriture.value = "";
        if (listeProposition[i] === undefined) {
            afficherProposition("Le jeu est fini");
            btnValiderMot.disabled = true; // pour rendre impossible de cliquer sur un bouton
        } else { 
            afficherProposition(listeProposition[i]);
        }
    });

    // Gestion de l'événement change sur les boutons radios, avoir le choix entre mots et phrases
    let boutonRadioChoix = document.querySelectorAll(".optionSource input");
    for (let index = 0; index < boutonRadioChoix.length; index ++) {
        boutonRadioChoix[index].addEventListener("change", (event) => {
            // Si c'est le premier élément qui a été modifié, alors nous voulons
            // jouer avec la listeMots. 
            if (event.target.value === "1") {
                listeProposition = listeMots;
            } else {
                // Sinon nous voulons jouer avec la liste des phrases
                listeProposition = listePhrases;
            }
            // Et on modifie l'affichage en direct. 
            afficherProposition(listeProposition[i]);
        })
    }

    // Gestion de l'événement submit sur le formulaire de partage popup
    let form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let scoreEmail = `${score} / ${i}`;
        gererFormulaire(scoreEmail);
    })

    afficherResultat(score, i);
}