import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import MeetingComponentsPage, { MeetingDeleteDialog } from './meeting.page-object';
import MeetingUpdatePage from './meeting-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('Meeting e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let meetingComponentsPage: MeetingComponentsPage;
  let meetingUpdatePage: MeetingUpdatePage;
  /* let meetingDeleteDialog: MeetingDeleteDialog; */

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

  it('should load Meetings', async () => {
    await navBarPage.getEntityPage('meeting');
    meetingComponentsPage = new MeetingComponentsPage();
    expect(await meetingComponentsPage.getTitle().getText()).to.match(/Meetings/);
  });

  it('should load create Meeting page', async () => {
    await meetingComponentsPage.clickOnCreateButton();
    meetingUpdatePage = new MeetingUpdatePage();
    expect(await meetingUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.meetingMeeting.home.createOrEditLabel/);
    await meetingUpdatePage.cancel();
  });

  /*  it('should create and save Meetings', async () => {
        async function createMeeting() {
            await meetingComponentsPage.clickOnCreateButton();
            await meetingUpdatePage.setTitleInput('title');
            expect(await meetingUpdatePage.getTitleInput()).to.match(/title/);
            await meetingUpdatePage.setDescriptionInput('description');
            expect(await meetingUpdatePage.getDescriptionInput()).to.match(/description/);
            await meetingUpdatePage.setStartDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
            expect(await meetingUpdatePage.getStartDateInput()).to.contain('2001-01-01T02:30');
            await meetingUpdatePage.setEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
            expect(await meetingUpdatePage.getEndDateInput()).to.contain('2001-01-01T02:30');
            await meetingUpdatePage.meetingRoomSelectLastOption();
            // meetingUpdatePage.participantSelectLastOption();
            await waitUntilDisplayed(meetingUpdatePage.getSaveButton());
            await meetingUpdatePage.save();
            await waitUntilHidden(meetingUpdatePage.getSaveButton());
            expect(await meetingUpdatePage.getSaveButton().isPresent()).to.be.false;
        }

        await createMeeting();
        await meetingComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeCreate = await meetingComponentsPage.countDeleteButtons();
        await createMeeting();

        await meetingComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
        expect(await meetingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    }); */

  /*  it('should delete last Meeting', async () => {
        await meetingComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeDelete = await meetingComponentsPage.countDeleteButtons();
        await meetingComponentsPage.clickOnLastDeleteButton();

        const deleteModal = element(by.className('modal'));
        await waitUntilDisplayed(deleteModal);

        meetingDeleteDialog = new MeetingDeleteDialog();
        expect(await meetingDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.meetingMeeting.delete.question/);
        await meetingDeleteDialog.clickOnConfirmButton();

        await meetingComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
        expect(await meetingComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
