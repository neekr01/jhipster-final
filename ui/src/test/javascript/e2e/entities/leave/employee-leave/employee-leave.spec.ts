import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import EmployeeLeaveComponentsPage, { EmployeeLeaveDeleteDialog } from './employee-leave.page-object';
import EmployeeLeaveUpdatePage from './employee-leave-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../../util/utils';

const expect = chai.expect;

describe('EmployeeLeave e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeLeaveComponentsPage: EmployeeLeaveComponentsPage;
  let employeeLeaveUpdatePage: EmployeeLeaveUpdatePage;
  let employeeLeaveDeleteDialog: EmployeeLeaveDeleteDialog;

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

  it('should load EmployeeLeaves', async () => {
    await navBarPage.getEntityPage('employee-leave');
    employeeLeaveComponentsPage = new EmployeeLeaveComponentsPage();
    expect(await employeeLeaveComponentsPage.getTitle().getText()).to.match(/Employee Leaves/);
  });

  it('should load create EmployeeLeave page', async () => {
    await employeeLeaveComponentsPage.clickOnCreateButton();
    employeeLeaveUpdatePage = new EmployeeLeaveUpdatePage();
    expect(await employeeLeaveUpdatePage.getPageTitle().getAttribute('id')).to.match(/uiApp.leaveEmployeeLeave.home.createOrEditLabel/);
    await employeeLeaveUpdatePage.cancel();
  });

  it('should create and save EmployeeLeaves', async () => {
    async function createEmployeeLeave() {
      await employeeLeaveComponentsPage.clickOnCreateButton();
      await employeeLeaveUpdatePage.setEmployeeCodeInput('employeeCode');
      expect(await employeeLeaveUpdatePage.getEmployeeCodeInput()).to.match(/employeeCode/);
      await employeeLeaveUpdatePage.setTotalInput('5');
      expect(await employeeLeaveUpdatePage.getTotalInput()).to.eq('5');
      await employeeLeaveUpdatePage.setAvailableInput('5');
      expect(await employeeLeaveUpdatePage.getAvailableInput()).to.eq('5');
      await waitUntilDisplayed(employeeLeaveUpdatePage.getSaveButton());
      await employeeLeaveUpdatePage.save();
      await waitUntilHidden(employeeLeaveUpdatePage.getSaveButton());
      expect(await employeeLeaveUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createEmployeeLeave();
    await employeeLeaveComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await employeeLeaveComponentsPage.countDeleteButtons();
    await createEmployeeLeave();

    await employeeLeaveComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await employeeLeaveComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last EmployeeLeave', async () => {
    await employeeLeaveComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await employeeLeaveComponentsPage.countDeleteButtons();
    await employeeLeaveComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    employeeLeaveDeleteDialog = new EmployeeLeaveDeleteDialog();
    expect(await employeeLeaveDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/uiApp.leaveEmployeeLeave.delete.question/);
    await employeeLeaveDeleteDialog.clickOnConfirmButton();

    await employeeLeaveComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await employeeLeaveComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
