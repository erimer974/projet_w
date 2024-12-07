const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body); // Récupérer les données envoyées par le formulaire
        const { name, email, manager_email, start_date, end_date, reason } = data;

        // Validation des champs
        if (!name || !email || !manager_email || !start_date || !end_date) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Tous les champs obligatoires ne sont pas remplis." }),
            };
        }

        // Configuration du transporteur SMTP avec les variables d'environnement
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Service SMTP
            auth: {
                user: process.env.SMTP_USER, // Email configuré dans les variables d'environnement
                pass: process.env.SMTP_PASS, // Mot de passe configuré dans les variables d'environnement
            },
        });

        // Configuration de l'email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: manager_email,
            replyTo: email,
            subject: `Demande de congés de ${name}`,
            text: `
                Bonjour,

                ${name} (${email}) a soumis une demande de congés.

                Détails de la demande :
                - Date de début : ${start_date}
                - Date de fin : ${end_date}
                - Motif : ${reason || "Non spécifié"}

                Cordialement,
                Formulaire de demande de congés
            `,
        };

        // Envoi de l'email
        await transporter.sendMail(mailOptions);

        // Réponse de succès
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "E-mail envoyé avec succès !" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur lors de l'envoi de l'email : " + error.message }),
        };
    }
};
