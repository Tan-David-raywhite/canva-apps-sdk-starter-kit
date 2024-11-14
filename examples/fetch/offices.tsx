import {
  Accordion,
  AccordionItem,
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
import { useState, useEffect } from "react";
import { addElementAtPoint } from "@canva/design";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";
import { useSelection } from "utils/use_selection_hook";

// const BACKEND_URL = `${BACKEND_HOST}/custom-route`;
const BACKEND_URL =
  "https://raywhiteapi.ep.dynamics.net/v1/organisations/?apiKey=df83a96e-0f55-4a20-82d9-eaa5f3e30335";
const BRANDTEMPLATEQUERY_URL =
  "https://api.canva.com/rest/v1/brand-templates/DAGVAJt80ds/dataset";
// const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/oauth/token";
const getBrandTemplate_URL =
  "https://api.canva.com/rest/v1/brand-templates/DAGVAJt80ds";

type State = "idle" | "loading" | "success" | "error";
type ListingSearchState = "idle" | "loading" | "success" | "error";

const Agents = () => {
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );
  const [agentMenuItems, setAgentMenuItems] = useState([
    {
      value: {
        id: 1,
        name: "name",
        emailAddress: "email@email.com",
        webSite: "http://raywhitedoublebay.com",
        address: {
          country: "Australia",
          countryCode: "AU",
          location: {
            lat: -33.877683,
            lon: 151.242768,
          },
          postCode: "2028",
          state: "New South Wales",
          stateCode: "NSW",
          streetName: "New South Head Road",
          streetNumber: "356",
          suburb: "Double Bay",
        },
        profile: {
          socialLinks: [
            {
              link: "https://www.facebook.com/raywhiteuppernorthshore",
              type: "Facebook",
            },
            {
              link: "https://g.page/r/CYCERWcoKCk9EAE",
              type: "Google My Business",
            },
            {
              link: "https://www.instagram.com/raywhitesouthbank/",
              type: "Instagram",
            },
            {
              link: "https://www.youtube.com/channel/UC_YOun04-z5jW09SRkYN1WA",
              type: "Youtube Channel",
            },
          ],
        },
        phones: [
          {
            internationalizedNumber: "+61 (2) 9363 9999",
            localNumber: "(02) 9363 9999",
            typeCode: "FIX",
          },
          {
            internationalizedNumber: "+61 (2) 9327 7717",
            localNumber: "(02) 9327 7717",
            typeCode: "FAX",
          },
        ],
      },
    },
  ]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({
    value: {
      id: 1,
      name: "name",
      emailAddress: "email@email.com",
      webSite: "http://raywhitedoublebay.com",
      address: {
        country: "Australia",
        countryCode: "AU",
        location: {
          lat: -33.877683,
          lon: 151.242768,
        },
        postCode: "2028",
        state: "New South Wales",
        stateCode: "NSW",
        streetName: "New South Head Road",
        streetNumber: "356",
        suburb: "Double Bay",
      },
      profile: {
        socialLinks: [
          {
            link: "https://www.facebook.com/raywhiteuppernorthshore",
            type: "Facebook",
          },
          {
            link: "https://g.page/r/CYCERWcoKCk9EAE",
            type: "Google My Business",
          },
          {
            link: "https://www.instagram.com/raywhitesouthbank/",
            type: "Instagram",
          },
          {
            link: "https://www.youtube.com/channel/UC_YOun04-z5jW09SRkYN1WA",
            type: "Youtube Channel",
          },
        ],
      },
      phones: [
        {
          internationalizedNumber: "+61 (2) 9363 9999",
          localNumber: "(02) 9363 9999",
          typeCode: "FIX",
        },
        {
          internationalizedNumber: "+61 (2) 9327 7717",
          localNumber: "(02) 9327 7717",
          typeCode: "FAX",
        },
      ],
    },
  });
  const [listingSearchState, setListingSearchState] =
    useState<ListingSearchState>("idle");
  // const currentSelection = useSelection("plaintext");
  // console.log(currentSelection);
  const headerTextStyle = {
    fontSize: "15px",
  };
  const onSearchInputClear = () => {
    setSearchInputValue("");
  };

  useEffect(() => {
    // Update the document title using the browser API
    // searchDataset();
    // getBrandTemplate();
  }, []);

  const getBrandTemplate = async () => {
    const token = await auth.getCanvaUserToken();
    fetch(getBrandTemplate_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  const searchDataset = async (data) => {
    const token = await auth.getCanvaUserToken();
    fetch("https://api.canva.com/rest/v1/autofills", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand_template_id: "DAGVAJt80ds",
        title: "string",
        data: {
          Property_Address: {
            type: "text",
            text: data,
          },
        },
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  const searchListings = async (label) => {
    try {
      setListingSearchState("loading");
      const token = await auth.getCanvaUserToken();
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: label,
        }),
      });

      const body = await res.json();
      setResponseBody(body.data);
      setAgentMenuItems(body.data);
      console.log(body.data);
      setListingSearchState("success");
    } catch (error) {
      setListingSearchState("error");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const onMenuItemClick = (item) => {
    console.log(item);
    setSelectedListing(item);
    setIsSearchMenuOpen(false);
  };

  const onListingTextResultClick = (text, data) => {
    switch (text) {
      case "Name":
        // searchDataset(data.name);
        addElementAtPoint({
          type: "text",
          children: [data.name],
        });
        break;
      case "email":
        addElementAtPoint({
          type: "text",
          children: [data.emailAddress],
        });
        break;
      case "address":
        addElementAtPoint({
          type: "text",
          children: [
            data.address.streetNumber +
              " " +
              data.address.streetName +
              " " +
              data.address.streetType +
              " " +
              data.address.suburb +
              " " +
              data.address.state +
              " " +
              data.address.postCode,
          ],
        });
        break;
      case "socials":
        addElementAtPoint({
          type: "text",
          children: [data.link],
        });
        break;
      case "website":
        addElementAtPoint({
          type: "text",
          children: [data.webSite],
        });
        break;
      default: {
        addElementAtPoint({
          type: "text",
          children: [
            data.address.streetNumber +
              " " +
              data.address.streetName +
              " " +
              data.address.streetType +
              " " +
              data.address.suburb +
              " " +
              data.address.state +
              " " +
              data.address.postCode,
          ],
        });
      }
    }
  };

  return (
    <div>
      <Rows spacing="2u">
        <SearchInputMenu
          placeholder="Search Office..."
          onChange={(value) => searchListings(value)}
          onFocus={() => setIsSearchMenuOpen(true)}
          onClear={onSearchInputClear}
        >
          {listingSearchState === "success" && isSearchMenuOpen && (
            <Menu>
              {agentMenuItems.map((item) => (
                <MenuItem
                  onClick={() => onMenuItemClick(item)}
                  key={item.value.id}
                >
                  <div style={headerTextStyle}>{item.value.name}</div>
                </MenuItem>
              ))}
            </Menu>
          )}
        </SearchInputMenu>
        {listingSearchState === "success" && selectedListing && (
          <Rows spacing="2u">
            <Title>{selectedListing.value.name}</Title>
            <Accordion>
              <AccordionItem title="Office name">
                <TypographyCard
                  ariaLabel="Office name"
                  onClick={() => {
                    onListingTextResultClick("Name", selectedListing.value);
                  }}
                >
                  <Text>{selectedListing.value.name}</Text>
                </TypographyCard>
              </AccordionItem>

              <AccordionItem title="Office email">
                <TypographyCard
                  ariaLabel="Office email"
                  onClick={() => {
                    onListingTextResultClick("email", selectedListing.value);
                  }}
                >
                  <Text>{selectedListing.value.emailAddress}</Text>
                </TypographyCard>
              </AccordionItem>
              <AccordionItem title="Office address">
                <TypographyCard
                  ariaLabel="Office address"
                  onClick={() => {
                    onListingTextResultClick("address", selectedListing.value);
                  }}
                >
                  <Text>
                    {selectedListing.value.address.streetNumber}{" "}
                    {selectedListing.value.address.streetName},{" "}
                    {selectedListing.value.address.suburb},{" "}
                    {selectedListing.value.address.state}{" "}
                    {selectedListing.value.address.postCode}
                  </Text>
                </TypographyCard>
              </AccordionItem>
              <AccordionItem title="Office socials">
                {selectedListing.value.profile.socialLinks
                  ? selectedListing.value.profile.socialLinks.map((item) => (
                      <TypographyCard
                        ariaLabel="Office socials"
                        onClick={() => {
                          onListingTextResultClick("socials", item);
                        }}
                      >
                        <Text>{item.type}:</Text>
                        <Text>{item.link}</Text>
                      </TypographyCard>
                    ))
                  : null}
              </AccordionItem>
              <AccordionItem title="Office website">
                <TypographyCard
                  ariaLabel="Office website"
                  onClick={() => {
                    onListingTextResultClick("website", selectedListing.value);
                  }}
                >
                  <Text>{selectedListing.value.webSite}</Text>
                </TypographyCard>
              </AccordionItem>
            </Accordion>
          </Rows>
        )}
      </Rows>
    </div>
  );
};

export default Agents;
