import FormController from './forms.js';
import LinkController from './links.js';
import PerfilController from './perfil.js';
import SocialMediaFormController from './socialMediaForm.js';
import SocialMediaController from './socialMediaLinks.js';

// * FORM CONTROLLER INIT

FormController.linkForm.initForm();
FormController.closeLinkForm.initForm();
FormController.socialMediaForm.initForm();
FormController.closeSocialMediaForm.initForm();

// * SOCIAL MEDIA FORM CONTROLLER

SocialMediaFormController.socialMediaForm.initSocialMediaForm();

// * LINK CONTROLLER INIT

LinkController.addLink.initLink();

// * SOCIAL MEDIA CONTROLLER

SocialMediaController.addSocialMedia.initSocialMedia();

// * PERFIL CONTROLLER INIT

PerfilController.perfilChange.initPerfil();

// ! PRÓXIMOS PASSOS:

// ! ADICIONAR BOTÕES DE DELETAR E EDITAR EM SOCIAL MEDIA
// ! ADICIONAR DOWNLOAD COMO PDF
// * BIBLIOTECA JSPDF