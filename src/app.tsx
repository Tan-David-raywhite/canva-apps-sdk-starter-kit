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
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  Title,
  TypographyCard,
} from "@canva/app-ui-kit";
import { auth } from "@canva/user";
import { useState } from "react";
import * as styles from "styles/components.css";

import Listings from "./listings";
import Agents from "./agents";
import Offices from "./offices";

// const BACKEND_URL = `${BACKEND_HOST}/custom-route`;
const BACKEND_URL =
  "https://raywhiteapi.ep.dynamics.net/v1/listings/?apiKey=df83a96e-0f55-4a20-82d9-eaa5f3e30335";
// const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/brand-templates/DAGQT21WyzM/dataset";
const BRANDTEMPLATEQUERY_URL = "https://api.canva.com/rest/v1/oauth/token";

type State = "idle" | "loading" | "success" | "error";
type ListingSearchState = "idle" | "loading" | "success" | "error";

export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [brandQueryState, setBrandQUeryState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );

  return (
    <div className={styles.scrollContainer}>
      <Tabs>
        <Rows spacing="3u">
          <TabList>
            <Tab id="Listings">Listings</Tab>
            <Tab id="Offices">Offices</Tab>
            <Tab id="Agents">Agents</Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="Offices">
              <Offices />
            </TabPanel>
            <TabPanel id="Agents">
              <Agents />
            </TabPanel>
            <TabPanel id="Listings">
              <Listings />
            </TabPanel>
          </TabPanels>
        </Rows>
      </Tabs>
    </div>
  );
};
