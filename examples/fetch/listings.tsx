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
import { useState, useEffect } from "react";
import { addElementAtPoint } from "@canva/design";
import { readContent } from "@canva/design";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

// const BACKEND_URL = `${BACKEND_HOST}/custom-route`;
const BACKEND_URL =
  "https://raywhiteapi.ep.dynamics.net/v1/listings/?apiKey=df83a96e-0f55-4a20-82d9-eaa5f3e30335";
// const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/brand-templates/DAGQT21WyzM/dataset";
const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/oauth/token";

type State = "idle" | "loading" | "success" | "error";
type ListingSearchState = "idle" | "loading" | "success" | "error";
const Listings = () => {
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );
  const [listingMenuItems, setListingMenuItems] = useState([
    {
      value: {
        id: 1,
        links: [
          {
            code: "PRL",
          },
        ],
        images: [
          {
            url: "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
            width: 4724,
            height: 3538,
          },
          {
            url: "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
            width: 4724,
            height: 3538,
          },
          {
            url: "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
            width: 4724,
            height: 3538,
          },
          {
            url: "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/ea9e-H2936675-68891007__1690931426-23210-DJI0113copy.jpg",
            width: 4724,
            height: 3538,
          },
        ],
        address: {
          streetNumber: "43",
          streetName: "Cedarvale",
          streetType: "Lane",
          streetTypeCode: "LANE",
          suburb: "Berry",
          suburbId: 3176,
          state: "New South Wales",
          stateCode: "NSW",
          country: "Australia",
          countryCode: "AU",
          postCode: "2535",
          location: {
            lat: -34.787002,
            lon: 150.631467,
          },
          formatted:
            "43 Cedarvale Lane\nBerry  New South Wales  2535\nAustralia",
        },
      },
    },
  ]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState({
    value: {
      id: 1,
      links: [
        {
          code: "PRL",
        },
      ],
      images: [
        {
          url: "https://cdn6.ep.dynamics.net/s3/rw-propertyimages/0060-H3148202-mydimport-1617794846-30255-005Open2viewID532131-16HarbordStreet.jpg",
          width: 4724,
          height: 3538,
        },
      ],
      description: "This is a description",
      address: {
        streetNumber: "43",
        streetName: "Cedarvale",
        streetType: "Lane",
        streetTypeCode: "LANE",
        suburb: "Berry",
        suburbId: 3176,
        state: "New South Wales",
        stateCode: "NSW",
        country: "Australia",
        countryCode: "AU",
        postCode: "2535",
        location: {
          lat: -34.787002,
          lon: 150.631467,
        },
        formatted: "43 Cedarvale Lane\nBerry  New South Wales  2535\nAustralia",
      },
      price: "1700000",
      title: "This is and awesome listing",
      type: "For Sale",
    },
  });
  const [listingSearchState, setListingSearchState] =
    useState<ListingSearchState>("idle");

  const [currentFields, setCurrentFields] = useState([]);

  const headerTextStyle = {
    fontSize: "15px",
  };

  useEffect(() => {
    checkContent();
  }, []);

  const checkContent = async () => {
    await readContent(
      {
        contentType: "richtext",
        context: "current_page",
      },
      async (draft) => {
        // Loop through each content item

        let fieldsArray = [];

        for (const content of draft.contents) {
          // Get the richtext content as plaintext
          const plaintext = content.readPlaintext();
          console.log(plaintext);

          let fieldObject = {
            name: plaintext,
            value: plaintext,
          };
          fieldsArray.push(fieldObject);
          // replace text with data
        }
        // Sync the content so that it's reflected in the design
        console.log("initial fields", fieldsArray);
        await setCurrentFields(fieldsArray);
      },
    );
  };
  const replaceContent = async (fieldType, fieldData) => {
    console.log(currentFields);

    var res = currentFields.find((x) => x.name === fieldType);
    console.log("Grabbed object", res);
    await readContent(
      {
        contentType: "richtext",
        context: "current_page",
      },
      async (draft) => {
        // Loop through each content item

        for (const content of draft.contents) {
          // Get the richtext content as plaintext
          const plaintext = content.readPlaintext();
          // replace text with data

          if (plaintext === res.value) {
            content.replaceText(
              { index: 0, length: plaintext.length },
              fieldData,
              {
                fontWeight: "normal",
              },
            );
            content.formatParagraph(
              { index: 0, length: plaintext.length },
              { fontWeight: "normal" },
            );
          }
        }
        // Sync the content so that it's reflected in the design
        await draft.sync();
        // update object
        const objIndex = currentFields.findIndex(
          (obj) => obj.name === fieldType,
        );
        currentFields[objIndex].value = fieldData;
        console.log("new object", currentFields);
      },
    );
  };

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
          "content-type": "application/json",
        },
        body: JSON.stringify({
          suggest: {
            address: label,
          },
        }),
      });

      const body = await res.json();
      setResponseBody(body.data);
      setListingMenuItems(body.data);
      // console.log(body.data)
      setListingSearchState("success");
    } catch (error) {
      setListingSearchState("loading");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const onMenuItemClick = (item) => {
    // console.log(item)
    setSelectedListing(item);
    setIsSearchMenuOpen(false);
  };

  const onListingTextResultClick = (text, data) => {
    switch (text) {
      case "Title":
        addElementAtPoint({
          type: "text",
          children: [data.title],
        });
        break;
      case "Address":
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
      case "Description":
        addElementAtPoint({
          type: "text",
          children: [data.description],
        });
        break;
      case "Price":
        addElementAtPoint({
          type: "text",
          children: [data.price],
        });
        break;
      case "Type":
        addElementAtPoint({
          type: "text",
          children: [data.type],
        });
        break;
      default: {
        addElementAtPoint({
          type: "text",
          children: [
            data.streetNumber +
              " " +
              data.streetName +
              " " +
              data.streetType +
              " " +
              data.suburb +
              " " +
              data.state +
              " " +
              data.postCode,
          ],
        });
      }
    }
  };

  return (
    <div>
      <Rows spacing="2u">
        <SearchInputMenu
          placeholder="Search Listings..."
          onChange={(value) => searchListings(value)}
          onFocus={() => setIsSearchMenuOpen(true)}
          onClear={onSearchInputClear}
        >
          {listingSearchState === "success" && isSearchMenuOpen && (
            <Menu>
              {listingMenuItems ? (
                listingMenuItems.map((item) => (
                  <MenuItem
                    onClick={() => onMenuItemClick(item)}
                    key={item.value.id}
                  >
                    <div style={headerTextStyle}>
                      {item.value.address.streetNumber}{" "}
                      {item.value.address.streetName}{" "}
                      {item.value.address.streetType}{" "}
                      {item.value.address.suburb}
                    </div>
                  </MenuItem>
                ))
              ) : (
                <></>
              )}
            </Menu>
          )}
        </SearchInputMenu>
      </Rows>
      <br />
      {listingSearchState === "success" && selectedListing && (
        <Rows spacing="1u">
          <Carousel>
            {selectedListing.value.images.map((item) => (
              <EmbedCard
                key={item.url}
                ariaLabel="Listing Image"
                onClick={() => {
                  // handleClick(item.url)
                  addElementAtPoint({
                    type: "embed",
                    url: item.url,
                  });
                }}
                thumbnailUrl={item.url}
                thumbnailHeight={120}
              />
            ))}
          </Carousel>
          <TypographyCard
            ariaLabel="Listing Title"
            onClick={() => {
              replaceContent(
                "LISTING_TITLE",
                selectedListing.value.title,
              );
            }}
          >
            <Text>
              Title:
              <br />
              {selectedListing.value.title}
            </Text>
          </TypographyCard>
          <TypographyCard
            ariaLabel="Listing Address"
            onClick={() => {
              // onListingTextResultClick("Address", selectedListing.value);
              replaceContent(
                "LISTING_ADDRESS",
                selectedListing.value.address.streetNumber +
                  selectedListing.value.address.streetName +
                  selectedListing.value.address.streetType +
                  selectedListing.value.address.suburb +
                  selectedListing.value.address.state +
                  selectedListing.value.address.postCode,
              );
            }}
          >
            <Text>
              Address:
              <br />
              {selectedListing.value.address.streetNumber}{" "}
              {selectedListing.value.address.streetName}{" "}
              {selectedListing.value.address.streetType}{" "}
              {selectedListing.value.address.suburb}{" "}
              {selectedListing.value.address.state}{" "}
              {selectedListing.value.address.postCode}
            </Text>
          </TypographyCard>
          <TypographyCard
            ariaLabel="Listing Price"
            onClick={() => {
              replaceContent("LISTING_PRICE", "$" + selectedListing.value.price);
            }}
          >
            <Text>
              Price:
              <br />
              {selectedListing.value.price}
            </Text>
          </TypographyCard>
        </Rows>
      )}
    </div>
  );
};

export default Listings;
