import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './leave-request.reducer';
import { ILeaveRequest } from 'app/shared/model/leave/leave-request.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ILeaveRequestProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type ILeaveRequestState = IPaginationBaseState;

export class LeaveRequest extends React.Component<ILeaveRequestProps, ILeaveRequestState> {
  state: ILeaveRequestState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getEntities();
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { leaveRequestList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="leave-request-heading">
          <Translate contentKey="uiApp.leaveLeaveRequest.home.title">Leave Requests</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="uiApp.leaveLeaveRequest.home.createLabel">Create a new Leave Request</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          {leaveRequestList && leaveRequestList.length > 0 ? (
            <Table responsive aria-describedby="leave-request-heading">
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('id')}>
                    <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('startDate')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.startDate">Start Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('endDate')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.endDate">End Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('creationDate')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.creationDate">Creation Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('departmentCode')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.departmentCode">Department Code</Translate>{' '}
                    <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('employeeCode')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.employeeCode">Employee Code</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('workingDays')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.workingDays">Working Days</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('description')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('leaveType')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.leaveType">Leave Type</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('status')}>
                    <Translate contentKey="uiApp.leaveLeaveRequest.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leaveRequestList.map((leaveRequest, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${leaveRequest.id}`} color="link" size="sm">
                        {leaveRequest.id}
                      </Button>
                    </td>
                    <td>
                      <TextFormat type="date" value={leaveRequest.startDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={leaveRequest.endDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={leaveRequest.creationDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>{leaveRequest.departmentCode}</td>
                    <td>{leaveRequest.employeeCode}</td>
                    <td>{leaveRequest.workingDays}</td>
                    <td>{leaveRequest.description}</td>
                    <td>
                      <Translate contentKey={`uiApp.LeaveRequestType.${leaveRequest.leaveType}`} />
                    </td>
                    <td>
                      <Translate contentKey={`uiApp.LeaveRequestStatus.${leaveRequest.status}`} />
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${leaveRequest.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${leaveRequest.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${leaveRequest.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="uiApp.leaveLeaveRequest.home.notFound">No Leave Requests found</Translate>
            </div>
          )}
        </div>
        <div className={leaveRequestList && leaveRequestList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={this.state.activePage} total={totalItems} itemsPerPage={this.state.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={this.state.activePage}
              onSelect={this.handlePagination}
              maxButtons={5}
              itemsPerPage={this.state.itemsPerPage}
              totalItems={this.props.totalItems}
            />
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ leaveRequest }: IRootState) => ({
  leaveRequestList: leaveRequest.entities,
  totalItems: leaveRequest.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaveRequest);
