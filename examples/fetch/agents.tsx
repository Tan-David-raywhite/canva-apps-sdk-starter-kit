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
import { addNativeElement } from "@canva/design";
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
      case 'Title':
        addNativeElement({
          type: "TEXT",
          children: [data.title]
        });
        break;
      case 'Address':
        addNativeElement({
          type: "TEXT",
          children: [data.address.streetNumber + ' ' + data.address.streetName + ' ' + data.address.streetType + ' ' + data.address.suburb + ' ' + data.address.state + ' ' + data.address.postCode],
        });
        break;
      case 'Description':
        addNativeElement({
          type: "TEXT",
          children: [data.description],
        });
        break;
      case 'Price':
        addNativeElement({
          type: "TEXT",
          children: [data.price],
        });
        break;
      case 'Type':
        addNativeElement({
          type: "TEXT",
          children: [data.type],
        });
        break;
      default: {
        addNativeElement({
          type: "TEXT",
          children: [data.streetNumber + ' ' + data.streetName + ' ' + data.streetType + ' ' + data.suburb + ' ' + data.state + ' ' + data.postCode],
        });
      }
    }
  };

  return (
    <div>
      <Rows spacing="2u">
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
      </Rows>
      {listingSearchState === "success" && selectedListing && (
        <Rows spacing="1u">
          <TypographyCard
            ariaLabel="Listing Title"
            onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
          >
            <Text>
              Name:<br />
              {selectedListing.value.name}
            </Text>
          </TypographyCard>
          <TypographyCard
            ariaLabel="Listing Title"
            onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
          >
            <Text>
              Email:<br />
              {selectedListing.value.emailAddress}
            </Text>
          </TypographyCard>
        </Rows>
      )}

    </div >
  );
};

export default Agents
