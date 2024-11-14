import {
  Button,
  Carousel,
  EmbedCard,
  FormField,
  MultilineInput,
  Menu,
  MenuItem,
  SearchInputMenu,
  Rows,
  Text,
  Title,
  TypographyCard,
} from "@canva/app-ui-kit";
import { auth } from "@canva/user";
import { useState } from "react";
import { addElementAtPoint } from "@canva/design";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

// const BACKEND_URL = `${BACKEND_HOST}/custom-route`;
const BACKEND_URL = "https://raywhiteapi.ep.dynamics.net/v1/members/?apiKey=df83a96e-0f55-4a20-82d9-eaa5f3e30335";
// const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/brand-templates/DAGQT21WyzM/dataset";
const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/oauth/token";

type State = "idle" | "loading" | "success" | "error";
type ListingSearchState = "idle" | "loading" | "success" | "error";

const Agents = () => {
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );
  const [agentMenuItems, setAgentMenuItems] = useState([{
    "value": {
      "id": 1,
      name: 'name',
    }
  }])
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({
    "value": {
      "id": 1,
      name: 'name',
      emailAddress: 'email@email.com',
      phones: [
        {
          internationalizedNumber: "+61 422 193 423",
          localNumber: "0422 193 423",
          typeCode: "MOB",
        }
      ],
      organisations: [
        {
          id: 721,
          membershipId: 273255,
          name: "Ray White Glenfield",
          office3LACode: "GLF",
          phones: [{
            internationalizedNumber: "+64 21 024 10431",
            localNumber: "021 024 10431",
            typeCode: "MOB"
          }],
          priority: 22,
          public: true,
          roleTitle: "Sales - Salesperson",
          roles: [{
            application: "NurtureCloud",
            applicationId: 46,
            id: 35994,
            role: "Agent",
          }],
          subTypeCode: "RWR",
          title: "Licensee Salesperson",
          typeCode: "RWO",
          userName: "glenfield.nz",
        }
      ]
    }
  });
  const [listingSearchState, setListingSearchState] = useState<ListingSearchState>("idle");

  const headerTextStyle = {
    fontSize: '15px'
  }
  const onSearchInputClear = () => {
    setSearchInputValue("");
  };

  const searchListings = async (label) => {
    try {
      setListingSearchState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(
          {
            "name": label
          }
        ),
      });

      const body = await res.json();
      setResponseBody(body.data);
      setAgentMenuItems(body.data);
      console.log(body.data)
      setListingSearchState("success");
    } catch (error) {
      setListingSearchState("error");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  const onMenuItemClick = (item) => {
    console.log(item)
    setSelectedListing(item)
    setIsSearchMenuOpen(false)
  }

  const onListingTextResultClick = (text, data) => {
    switch (text) {
      case 'Name':
        addElementAtPoint({
          type: "text",
          children: [data.name]
        });
        break;
      case 'Email':
        addElementAtPoint({
          type: "text",
          children: [data.emailAddress],
        });
        break;
      case 'Description':
        addElementAtPoint({
          type: "text",
          children: [data.description],
        });
        break;
      case 'Price':
        addElementAtPoint({
          type: "text",
          children: [data.price],
        });
        break;
      case 'Type':
        addElementAtPoint({
          type: "text",
          children: [data.type],
        });
        break;
      default: {
        addElementAtPoint({
          type: "text",
          children: [data.streetNumber + ' ' + data.streetName + ' ' + data.streetType + ' ' + data.suburb + ' ' + data.state + ' ' + data.postCode],
        });
      }
    }
  };

  return (
    <div>
      <Rows spacing="1.5u">
        <SearchInputMenu placeholder="Search Agents..." onChange={value => searchListings(value)} onFocus={() => setIsSearchMenuOpen(true)} onClear={onSearchInputClear}>
          {listingSearchState === "success" && isSearchMenuOpen && <Menu >
            {agentMenuItems.map(item => <MenuItem onClick={() => onMenuItemClick(item)} key={item.value.id}>
              <div style={headerTextStyle}>
                {item.value.name}
              </div>
            </MenuItem>
            )}
          </Menu>}
        </SearchInputMenu>
        {/* {listingSearchState === "success" && selectedListing && ( */}
        {(
          <>
            <TypographyCard
              ariaLabel="Agent Name"
              onClick={() => { onListingTextResultClick("Name", selectedListing.value) }}
            >
              <Text>
                Name:<br />
                {selectedListing.value.name}
              </Text>
            </TypographyCard>
            <TypographyCard
              ariaLabel="Agent Email"
              onClick={() => { onListingTextResultClick("Email", selectedListing.value) }}
            >
              <Text>
                Email:<br />
                {selectedListing.value.emailAddress}
              </Text>
            </TypographyCard>
            {/* <TypographyCard
              ariaLabel="Mobile number local"
              onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
            >
              <Text>
                Mobile number (local):<br />
                {selectedListing.value.phones[0].localNumber}
              </Text>
            </TypographyCard>
            <TypographyCard
              ariaLabel="Mobile number international"
              onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
            >
              <Text>
                Mobile number (international):<br />
                {selectedListing.value.phones[0].internationalizedNumber}
              </Text>
            </TypographyCard>
            <Title>Office details</Title>
            {
              selectedListing.value.organisations.map(item => (
                <>
                  <TypographyCard
                    ariaLabel="Office name"
                    onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
                  >
                    <Text>
                      Office name:<br />
                      {item.name}
                    </Text>
                  </TypographyCard>
                  <TypographyCard
                    ariaLabel="Office Title"
                    onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
                  >
                    <Text>
                      Title:<br />
                      {item.title}
                    </Text>
                  </TypographyCard>
                  <TypographyCard
                    ariaLabel="Mobile number local"
                    onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
                  >
                    <Text>
                      Mobile number (local):<br />
                      {item.phones[0].localNumber}
                    </Text>
                  </TypographyCard>
                  <TypographyCard
                    ariaLabel="Mobile number international"
                    onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
                  >
                    <Text>
                      Mobile number (international):<br />
                      {item.phones[0].internationalizedNumber}
                    </Text>
                  </TypographyCard>
                </>
              ))
            } */}
          </>

        )}

      </Rows>

    </div >
  );
};

export default Agents
