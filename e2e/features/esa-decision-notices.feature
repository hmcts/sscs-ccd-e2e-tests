Feature: ESA Final Decision Notices

  @esa-decision @nightly-test-10 @ESA-DN-1
  Scenario: Write ESA final decision WCA and refuse all
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should end "Ready to list" state

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "NO"
    And I select schedule 2 activities with <15 points and reg 29 "NO"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision upheld
    Then the case should end "Dormant" state

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-2
  Scenario: Write ESA final decision WCA and Support group, >= points for schedule 2, No Schedule 3, No reg 35 and refuse
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should end "Ready to list" state

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "YES" To Allowed "NO"
    And I select schedule 2 activities with >=15 points
    And I opt out schedule 3 activities and reg 35 "NO"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision upheld
    Then the case should end "Dormant" state

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-3
  Scenario: Write ESA final decision WCA and Support group, >= points for schedule 2, No Schedule 3, reg 35 YES and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should end "Ready to list" state

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with >=15 points
    And I opt out schedule 3 activities and reg 35 "YES"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should end "Dormant" state

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-4
  Scenario: Write ESA final decision WCA and Support group, >= points for schedule 2, Select Schedule 3 and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "YES" To Allowed "YES"
    And I select schedule 2 activities with >=15 points
    And I select schedule 3 activities
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-5
  Scenario: Write ESA final decision WCA and Not support group, >= points for schedule 2, No Schedule 3, No reg 35 and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with >=15 points
    And I opt out schedule 3 activities and reg 35 "NO"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-6
  Scenario: Write ESA final decision WCA and Not support group, >= points for schedule 2, Select Schedule 3 and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with >=15 points
    And I select schedule 3 activities
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-7
  Scenario: Write ESA final decision WCA and Not support group, <15 points for schedule 2, reg 29 YES, No Schedule 3, reg 35 NO,  and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with <15 points and reg 29 "YES"
    And I opt out schedule 3 activities and reg 35 "NO"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-8
  Scenario: Write ESA final decision WCA and Not support group, <15 points for schedule 2, reg 29 YES, No Schedule 3, reg 35 YES,  and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with <15 points and reg 29 "YES"
    And I opt out schedule 3 activities and reg 35 "YES"
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-9
  Scenario: Write ESA final decision WCA and Not support group, <15 points for schedule 2, reg 29 YES, Select Schedule 3 and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "YES" and Support group "NO" To Allowed "YES"
    And I select schedule 2 activities with <15 points and reg 29 "YES"
    And I select schedule 3 activities
    And I continue writing final decision WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"


  @esa-decision @nightly-test-10 @ESA-DN-10
  Scenario: Write ESA final decision non WCA and refuse all
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "NO" and Support group "NO" To Allowed "NO"
    And I continue writing final decision non WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision upheld
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-11
  Scenario: Write ESA final decision non WCA and allow
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I write a final decision of WCA appeal "NO" and Support group "NO" To Allowed "YES"
    And I continue writing final decision non WCA appeal
    And I provide reasons and check answers
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

  @esa-decision @nightly-test-10 @ESA-DN-11
  Scenario: Write ESA final decision with manual upload
    Given I am signed in as a Case Officer
    And I have a ESA bulk-scanned document with all fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information "NO"
    Then the case should be in "Ready to list" appeal status

    When I switch to be a Judge
    When I choose "Write final decision"
    And I choose manual upload
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status

    And I see "Final Decision Notice"

