import {
  Accordion,
  AccordionItem,
  Button,
  Carousel,
  EmbedCard,
  FormField,
  MultilineInput,
  ImageCard,
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
import { addElementAtCursor, addElementAtPoint, ui } from "@canva/design";
import { editContent } from "@canva/design";
import { useFeatureSupport } from "utils/use_feature_support";
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

const Offices = () => {
  const isSupported = useFeatureSupport();
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );
  const [agentMenuItems, setAgentMenuItems] = useState([
  ]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [selectedOffices, setselectedOffices] = useState({
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

  const searchOffices = async (label) => {
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
      // console.log(body.data);
      setListingSearchState("success");
    } catch (error) {
      setListingSearchState("loading");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const onMenuItemClick = (item) => {
    setselectedOffices(item);
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

  function handleDragStartText(event: React.DragEvent<HTMLElement>) {
    if (isSupported(ui.startDragToPoint)) {
      console.log(event)
      ui.startDragToPoint(event, {
        type: "text",
        children: [event.target.ariaLabel],
      });
    }

    if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, {
        type: "text",
        children: [event.target.ariaLabel],
      });
    }
  }

  async function handleImageClick(event) {
    if (isSupported(addElementAtPoint)) {
      const asset = await upload({
        mimeType: "image/png",
        thumbnailUrl:
          event.target.ariaLabel,
        type: "image",
        url: event.target.ariaLabel,
        width: 320,
        height: 212,
        aiDisclosure: "none",
      });

      addElementAtPoint({
        type: "image",
        ref: asset.ref,
        altText: {
          text: "Example grass image",
          decorative: false
        },
      });
    }

    if (isSupported(addElementAtCursor)) {
      const asset = await upload({
        mimeType: "image/png",
        thumbnailUrl:
          event.target.ariaLabel,
        type: "image",
        url: event.target.ariaLabel,
        width: 320,
        height: 212,
        aiDisclosure: "none",
      });

      addElementAtCursor({
        type: "image",
        ref: asset.ref,
        altText: {
          text: "Example grass image",
          decorative: false
        },
      });
    }
  }

  function handleImageDragStart(event: React.DragEvent<HTMLElement>) {
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, {
        type: "image",
        resolveImageRef: () => {
          return upload({
            mimeType: "image/png",
            thumbnailUrl:
              event.target.ariaLabel,
            type: "image",
            url: event.target.ariaLabel,
            width: 320,
            height: 212,
            aiDisclosure: "none",
          });
        },
        previewUrl:
          event.target.ariaLabel,
        previewSize: {
          width: 320,
          height: 212,
        },
        fullSize: {
          width: 320,
          height: 212,
        },
      });
    }

    if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, {
        type: "image",
        resolveImageRef: () => {
          return upload({
            mimeType: "image/png",
            thumbnailUrl: event.target.ariaLabel,
            type: "image",
            url: event.target.ariaLabel,
            width: 320,
            height: 212,
            aiDisclosure: "none",
          });
        },
        previewUrl: event.target.ariaLabel,
        previewSize: {
          width: 320,
          height: 212,
        },
        fullSize: {
          width: 320,
          height: 212,
        },
      });
    }
  }

  return (
    <div>
      <Rows spacing="2u">
        <SearchInputMenu
          placeholder="Search Office..."
          onChange={(value) => searchOffices(value)}
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
        {listingSearchState === "success" && selectedOffices && (

          Object.hasOwn(selectedOffices, 'value') ?
            <Rows spacing="2u">
              <TypographyCard
                ariaLabel={selectedOffices.value.name}
                onDragStart={handleDragStartText}
              >
                <Text>Name: <br />{selectedOffices.value.name}</Text>
              </TypographyCard>
              <TypographyCard
                ariaLabel={selectedOffices.value.emailAddress}
                onDragStart={handleDragStartText}
              >
                <Text>Email <br /> {selectedOffices.value.emailAddress}</Text>
              </TypographyCard>
              <TypographyCard
                ariaLabel={selectedOffices.value.address.streetNumber +
                  selectedOffices.value.address.streetName +
                  selectedOffices.value.address.streetType +
                  selectedOffices.value.address.suburb +
                  selectedOffices.value.address.state +
                  selectedOffices.value.address.postCode}
                onDragStart={handleDragStartText}
              >
                <Text>
                  Address <br />
                  {selectedOffices.value.address.streetNumber}{" "}
                  {selectedOffices.value.address.streetName},{" "}
                  {selectedOffices.value.address.suburb},{" "}
                  {selectedOffices.value.address.state}{" "}
                  {selectedOffices.value.address.postCode}
                </Text>
              </TypographyCard>
              {selectedOffices.value.profile.socialLinks
                ? selectedOffices.value.profile.socialLinks.map((item) => (
                  <TypographyCard
                    ariaLabel={item.link}
                    onDragStart={handleDragStartText}
                  >
                    <Text>{item.type}:</Text>
                    <Text>{item.link}</Text>
                  </TypographyCard>
                ))
                : null}
              <TypographyCard
                ariaLabel={selectedOffices.value.webSite}
                onDragStart={handleDragStartText}
              >
                <Text>Website <br /> {selectedOffices.value.webSite}</Text>
              </TypographyCard>

              {
                selectedOffices.value.currentRecognition ?
                  <div>
                    <Title
                      alignment="start"
                      capitalization="default"
                      size="small"
                    >
                      Current recognition
                    </Title>
                    {
                      selectedOffices.value.currentRecognition.map((item) => {
                        return (
                          <Accordion>
                            <AccordionItem title={item.award}>
                              <TypographyCard
                                ariaLabel={item.award}
                                onDragStart={handleDragStartText}
                              >
                                <Text>Award name: <br /> {item.award}</Text>
                              </TypographyCard>
                              <br />
                              <br />
                              <EmbedCard
                                key={item.pictureUrl}
                                ariaLabel={item.pictureUrl}
                                onDragStart={handleImageDragStart}
                                onClick={() => {
                                  handleImageClick
                                  // handleClick(item.url)
                                  // addElementAtPoint({
                                  //   type: "embed",
                                  //   url: item.url,
                                  // });
                                }}
                                thumbnailUrl={item.pictureUrl}
                                thumbnailAspectRatio={1.5}
                              />
                            </AccordionItem>
                          </Accordion>
                        )
                      })
                    }

                  </div>
                  :
                  null
              }
            </Rows>
            :
            null
        )}
      </Rows >
    </div >
  );
};

export default Offices;

