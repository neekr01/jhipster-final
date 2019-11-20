import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import MeetingRoomComponentsPage, { MeetingRoomDeleteDialog } from './meeting-room.page-object';
import MeetingRoomUpdatePage from './meeting-room-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('MeetingRoom e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let meetingRoomComponentsPage: MeetingRoomComponentsPage;
  let meetingRoomUpdatePage: MeetingRoomUpdatePage;
  let meetingRoomDeleteDialog: MeetingRoomDeleteDialog;

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

  it('should load MeetingRooms', async () => {
    await navBarPage.getEntityPage('meeting-room');
    meetingRoomComponentsPage = new MeetingRoomComponentsPage();
    expect(await meetingRoomComponentsPage.getTitle().getText()).to.match(/Meeting Rooms/);
  });

  it('should load create MeetingRoom page', async () => {
    await meetingRoomComponentsPage.clickOnCreateButton();
    meetingRoomUpdatePage = new MeetingRoomUpdatePage();
    expect(await meetingRoomUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.meetingMeetingRoom.home.createOrEditLabel/);
    await meetingRoomUpdatePage.cancel();
  });

  it('should create and save MeetingRooms', async () => {
    async function createMeetingRoom() {
      await meetingRoomComponentsPage.clickOnCreateButton();
      await meetingRoomUpdatePage.setCodeInput('code');
      expect(await meetingRoomUpdatePage.getCodeInput()).to.match(/code/);
      await meetingRoomUpdatePage.setLocationInput('location');
      expect(await meetingRoomUpdatePage.getLocationInput()).to.match(/location/);
      await meetingRoomUpdatePage.setNameInput('name');
      expect(await meetingRoomUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(meetingRoomUpdatePage.getSaveButton());
      await meetingRoomUpdatePage.save();
      await waitUntilHidden(meetingRoomUpdatePage.getSaveButton());
      expect(await meetingRoomUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createMeetingRoom();
    await meetingRoomComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await meetingRoomComponentsPage.countDeleteButtons();
    await createMeetingRoom();

    await meetingRoomComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await meetingRoomComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last MeetingRoom', async () => {
    await meetingRoomComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await meetingRoomComponentsPage.countDeleteButtons();
    await meetingRoomComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    meetingRoomDeleteDialog = new MeetingRoomDeleteDialog();
    expect(await meetingRoomDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.meetingMeetingRoom.delete.question/);
    await meetingRoomDeleteDialog.clickOnConfirmButton();

    await meetingRoomComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await meetingRoomComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
