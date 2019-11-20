import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import LeaveRequestComponentsPage, { LeaveRequestDeleteDialog } from './leave-request.page-object';
import LeaveRequestUpdatePage from './leave-request-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('LeaveRequest e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let leaveRequestComponentsPage: LeaveRequestComponentsPage;
  let leaveRequestUpdatePage: LeaveRequestUpdatePage;
  let leaveRequestDeleteDialog: LeaveRequestDeleteDialog;

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

  it('should load LeaveRequests', async () => {
    await navBarPage.getEntityPage('leave-request');
    leaveRequestComponentsPage = new LeaveRequestComponentsPage();
    expect(await leaveRequestComponentsPage.getTitle().getText()).to.match(/Leave Requests/);
  });

  it('should load create LeaveRequest page', async () => {
    await leaveRequestComponentsPage.clickOnCreateButton();
    leaveRequestUpdatePage = new LeaveRequestUpdatePage();
    expect(await leaveRequestUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.leaveLeaveRequest.home.createOrEditLabel/);
    await leaveRequestUpdatePage.cancel();
  });

  it('should create and save LeaveRequests', async () => {
    async function createLeaveRequest() {
      await leaveRequestComponentsPage.clickOnCreateButton();
      await leaveRequestUpdatePage.setStartDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await leaveRequestUpdatePage.getStartDateInput()).to.contain('2001-01-01T02:30');
      await leaveRequestUpdatePage.setEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await leaveRequestUpdatePage.getEndDateInput()).to.contain('2001-01-01T02:30');
      await leaveRequestUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await leaveRequestUpdatePage.getCreationDateInput()).to.contain('2001-01-01T02:30');
      await leaveRequestUpdatePage.setDepartmentCodeInput('departmentCode');
      expect(await leaveRequestUpdatePage.getDepartmentCodeInput()).to.match(/departmentCode/);
      await leaveRequestUpdatePage.setEmployeeCodeInput('employeeCode');
      expect(await leaveRequestUpdatePage.getEmployeeCodeInput()).to.match(/employeeCode/);
      await leaveRequestUpdatePage.setWorkingDaysInput('5');
      expect(await leaveRequestUpdatePage.getWorkingDaysInput()).to.eq('5');
      await leaveRequestUpdatePage.setDescriptionInput('description');
      expect(await leaveRequestUpdatePage.getDescriptionInput()).to.match(/description/);
      await leaveRequestUpdatePage.leaveTypeSelectLastOption();
      await leaveRequestUpdatePage.statusSelectLastOption();
      await waitUntilDisplayed(leaveRequestUpdatePage.getSaveButton());
      await leaveRequestUpdatePage.save();
      await waitUntilHidden(leaveRequestUpdatePage.getSaveButton());
      expect(await leaveRequestUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createLeaveRequest();
    await leaveRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await leaveRequestComponentsPage.countDeleteButtons();
    await createLeaveRequest();

    await leaveRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await leaveRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last LeaveRequest', async () => {
    await leaveRequestComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await leaveRequestComponentsPage.countDeleteButtons();
    await leaveRequestComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    leaveRequestDeleteDialog = new LeaveRequestDeleteDialog();
    expect(await leaveRequestDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.leaveLeaveRequest.delete.question/);
    await leaveRequestDeleteDialog.clickOnConfirmButton();

    await leaveRequestComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await leaveRequestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
