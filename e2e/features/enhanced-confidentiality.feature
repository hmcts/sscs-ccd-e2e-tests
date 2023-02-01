Feature: Enhanced confidentiality

    @nightly-test-skip @preview-test-skip @ec-10106
    Scenario: Enhanced confidentiality scenario
        Given I presetup an "UC" SYA case
        And I am signed in as a Case Officer
        And I navigate to an existing case
        Given I choose "Upload response"
        And I upload UC further information with disputed General disputed by others No and further info No
        And I wait "8" seconds
        And I choose "Action further evidence"
        And I fill the further evidence form with "Review by Judge" and "Confidentiality request"
        And I choose "Review confidentiality request"
        When I "grant" confidentiality request
        Then I should see "Is case confidential? Yes"
        Given I choose "Supplementary response"
        When I upload supplementary response
        Then I should see supplementary response in the Unprocessed Correspondence tab
        Given I choose "Action further evidence"
        When I upload a document with redacted content
        Then I should see redacted content in Documents tab
        When I choose "Create a bundle"
        And I submit "Create a bundle"
        Then the bundles should be successfully listed in "History" tab
        And the case bundle details should be listed in "Bundles" tab
        And the "SSCS Bundle Edited" bundle configuration should have been used
        And the "SSCS Bundle Original" bundle configuration should have been used
