import {
  Button,
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

// const BACKEND_URL = `${BACKEND_HOST}/custom-route`;
const BACKEND_URL = "https://raywhiteapi.ep.dynamics.net/v1/listings/?apiKey=df83a96e-0f55-4a20-82d9-eaa5f3e30335";
// const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/brand-templates/DAGQT21WyzM/dataset";
const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/oauth/token";

type State = "idle" | "loading" | "success" | "error";

export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );
  const [listingMenuItems, setListingMenuItems] = useState([{
    "value": {
      "id": 1,
      "links": [
        {
          code: 'PRL'
        }
      ]
      ,
      "images": [
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        }
      ],
      "address": {
        "streetNumber": "43",
        "streetName": "Cedarvale",
        "streetType": "Lane",
        "streetTypeCode": "LANE",
        "suburb": "Berry",
        "suburbId": 3176,
        "state": "New South Wales",
        "stateCode": "NSW",
        "country": "Australia",
        "countryCode": "AU",
        "postCode": "2535",
        "location": {
          "lat": -34.787002,
          "lon": 150.631467
        },
        "formatted": "43 Cedarvale Lane\nBerry  New South Wales  2535\nAustralia"
      },
    }
  }]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({
    "value": {
      "id": 1,
      "links": [
        {
          code: 'PRL'
        }
      ]
      ,
      "images": [
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        },
        {
          "url": "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
          "width": 4724,
          "height": 3538
        }
      ],
      description: 'This is a description',
      "address": {
        "streetNumber": "43",
        "streetName": "Cedarvale",
        "streetType": "Lane",
        "streetTypeCode": "LANE",
        "suburb": "Berry",
        "suburbId": 3176,
        "state": "New South Wales",
        "stateCode": "NSW",
        "country": "Australia",
        "countryCode": "AU",
        "postCode": "2535",
        "location": {
          "lat": -34.787002,
          "lon": 150.631467
        },
        "formatted": "43 Cedarvale Lane\nBerry  New South Wales  2535\nAustralia"
      },
      price: "1700000",
      title: 'This is and awesome listing',
      type: "For Sale"
    }
  });

  const headerTextStyle = {
    fontSize: '15px'
  }

  const sendGetRequest = async () => {
    try {
      setState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();
      setResponseBody(body);
      setState("success");
    } catch (error) {
      setState("error");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  const queryBrandTemplate = async () => {
    try {
      setBrandQUeryState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BRANDTEMPLATEQUERY_URL,
        {
          method: 'POST',
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },

        });

      const body = await res.json();
      setResponseBody(body);
      setBrandQUeryState("success");
    } catch (error) {
      setBrandQUeryState("error");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  const onSearchInputClear = () => {
    setSearchInputValue("");
  };

  const searchListings = async (label) => {
    try {
      setState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(
          {
            "suggest": {
              "address": label
            }
          }
        ),
      });

      const body = await res.json();
      setResponseBody(body.data);
      setListingMenuItems(body.data);
      console.log(body.data)
      setState("success");
    } catch (error) {
      setState("error");
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
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can securely communicate with their
          servers via the browser's Fetch API.
        </Text>
        {/* Idle and loading state */}
        {state !== "error" && (
          <>
            <Button
              variant="primary"
              onClick={sendGetRequest}
              loading={state === "loading"}
              stretch
            >
              Send GET request
            </Button>
            {state === "success" && responseBody && (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={2} autoGrow readOnly />
                )}
              />
            )}
            <Button
              variant="secondary"
              onClick={queryBrandTemplate}
              loading={brandQueryState === "loading"}
              stretch
            >
              query Brand Template
            </Button>
            {brandQueryState === "success" && responseBody && (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={25} autoGrow readOnly />
                )}
              />
            )}
          </>
        )}
      </Rows>
      <Rows spacing="3u">
        {/* Error brandQueryState */}
        {brandQueryState === "error" && (
          <Rows spacing="3u">
            <Rows spacing="1u">
              <Title size="small">Something went wrong</Title>
              <Text>To see the error, check the JavaScript Console.</Text>
            </Rows>
            <Button
              variant="secondary"
              onClick={() => {
                setBrandQUeryState("idle");
              }}
              stretch
            >
              Reset
            </Button>
          </Rows>
        )}
      </Rows>

      <Rows spacing="2u">
        <SearchInputMenu placeholder="Search..." onChange={value => searchListings(value)} onFocus={() => setIsSearchMenuOpen(true)} onClear={onSearchInputClear}>
          {isSearchMenuOpen && <Menu >
            {listingMenuItems.map(item => <MenuItem onClick={() => onMenuItemClick(item)} key={item.value.id}>
              <div style={headerTextStyle}>
                {item.value.address.streetNumber} {item.value.address.streetName} {item.value.address.streetType} {item.value.address.suburb}
              </div>
            </MenuItem>
            )}
          </Menu>}
        </SearchInputMenu>
      </Rows>
      <br />
      <Rows spacing="1u">
        <TypographyCard
          ariaLabel="Listing Title"
          onClick={() => { onListingTextResultClick("Title", selectedListing.value) }}
        >
          <Text>
            Title:<br />
            {selectedListing.value.title}
          </Text>
        </TypographyCard>
        <TypographyCard
          ariaLabel="Listing Address"
          onClick={() => { onListingTextResultClick("Address", selectedListing.value) }}
        >
          <Text>
            Address:<br />
            {selectedListing.value.address.streetNumber} {selectedListing.value.address.streetName} {selectedListing.value.address.streetType} {selectedListing.value.address.suburb} {selectedListing.value.address.state} {selectedListing.value.address.postCode}
          </Text>
        </TypographyCard>
        <TypographyCard
          ariaLabel="Listing Description"
          onClick={() => { onListingTextResultClick("Description", selectedListing.value) }}
        >
          <Text lineClamp={3}>
            Description:<br />
            {selectedListing.value.description}
          </Text>
        </TypographyCard>
        <TypographyCard
          ariaLabel="Listing Price"
          onClick={() => { onListingTextResultClick("Price", selectedListing.value) }}
        >
          <Text>
            Price:<br />
            {selectedListing.value.price}
          </Text>
        </TypographyCard>
        <TypographyCard
          ariaLabel="Listing Type"
          onClick={() => { onListingTextResultClick("Type", selectedListing.value) }}
        >
          <Text>
            Type:<br />
            {selectedListing.value.type}
          </Text>
        </TypographyCard>
      </Rows>
    </div >
  );
};
