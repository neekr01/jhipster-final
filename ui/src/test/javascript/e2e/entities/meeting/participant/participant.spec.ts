import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import ParticipantComponentsPage, { ParticipantDeleteDialog } from './participant.page-object';
import ParticipantUpdatePage from './participant-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('Participant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let participantComponentsPage: ParticipantComponentsPage;
  let participantUpdatePage: ParticipantUpdatePage;
  let participantDeleteDialog: ParticipantDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Participants', async () => {
    await navBarPage.getEntityPage('participant');
    participantComponentsPage = new ParticipantComponentsPage();
    expect(await participantComponentsPage.getTitle().getText()).to.match(/Participants/);
  });

  it('should load create Participant page', async () => {
    await participantComponentsPage.clickOnCreateButton();
    participantUpdatePage = new ParticipantUpdatePage();
    expect(await participantUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.meetingParticipant.home.createOrEditLabel/);
    await participantUpdatePage.cancel();
  });

  it('should create and save Participants', async () => {
    async function createParticipant() {
      await participantComponentsPage.clickOnCreateButton();
      await participantUpdatePage.setEmailInput('email');
      expect(await participantUpdatePage.getEmailInput()).to.match(/email/);
      await waitUntilDisplayed(participantUpdatePage.getSaveButton());
      await participantUpdatePage.save();
      await waitUntilHidden(participantUpdatePage.getSaveButton());
      expect(await participantUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createParticipant();
    await participantComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await participantComponentsPage.countDeleteButtons();
    await createParticipant();

    await participantComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await participantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Participant', async () => {
    await participantComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await participantComponentsPage.countDeleteButtons();
    await participantComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    participantDeleteDialog = new ParticipantDeleteDialog();
    expect(await participantDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.meetingParticipant.delete.question/);
    await participantDeleteDialog.clickOnConfirmButton();

    await participantComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await participantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
