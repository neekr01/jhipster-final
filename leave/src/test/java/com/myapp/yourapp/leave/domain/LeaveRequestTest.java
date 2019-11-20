package com.myapp.yourapp.leave.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.myapp.yourapp.leave.web.rest.TestUtil;

public class LeaveRequestTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaveRequest.class);
        LeaveRequest leaveRequest1 = new LeaveRequest();
        leaveRequest1.setId("id1");
        LeaveRequest leaveRequest2 = new LeaveRequest();
        leaveRequest2.setId(leaveRequest1.getId());
        assertThat(leaveRequest1).isEqualTo(leaveRequest2);
        leaveRequest2.setId("id2");
        assertThat(leaveRequest1).isNotEqualTo(leaveRequest2);
        leaveRequest1.setId(null);
        assertThat(leaveRequest1).isNotEqualTo(leaveRequest2);
    }
}
