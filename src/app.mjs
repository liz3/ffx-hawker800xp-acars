import { registerPlugin, Subject } from "@microsoft/msfs-sdk";
import {
  WT21FmcAvionicsPlugin,
  UserSettingsPage,
  DataLinkMenuPage,
  IndexPage,
} from "@microsoft/msfs-wt21-fmc";
import AcarsSettingsExtension from "./SettingsExtension.mjs";
import CduRenderer from "./CduRenderer.mjs";
import acarsService from "./AcarsService.mjs";
import DatalinkAtisPage from "./pages/AtisPage.mjs";
import DatalinkSendMessagesPage from "./pages/SendMessages.mjs";
import DatalinkReceivedMessagesPage from "./pages/ReceivedMessages.mjs";
import DatalinkPageExtension from "./DataLinkPageExtension.mjs";
import FansPage from "./pages/FansPage.mjs";
import IndexPageExtension from "./IndexPageExtension.mjs";
import DatalinkMessagePage from "./pages/MessagePage.mjs";
import FansRequestPage from "./pages/FansRequestsPage.mjs";
import { CpdlcStatusPage } from "./pages/CpdlcStatusPage.mjs";
import DatalinkCombinedMessagesPage from "./pages/CombinedMessages.mjs";
import DatalinkTwipPage from "./pages/TwipPage.mjs";
import DatalinkPosReportPage from "./pages/PosReport.mjs";
import { DatalinkLevelPage } from "./pages/LevelPage.mjs";
import DatalinkSpeedPage from "./pages/SpeedPage.mjs";
import { DatalinkDirectToPage } from "./pages/RouteRequestPage.mjs";
import DatalinkTelexPage from "./pages/TelexPage.mjs";
import DatalinkPreDepartureRequestPage from "./pages/PdcPage.mjs";
import DatalinkOceanicRequestPage from "./pages/OceanicClearance.mjs";
import { MESSAGE_LEVEL, MESSAGE_TARGET, MessageDefinition, MessageDefinitions, OperatingMessage } from "@microsoft/msfs-wt21-shared";

class Hawker800XpAcars extends WT21FmcAvionicsPlugin {
  constructor(binder) {
    super(binder);
    this.binder = binder;
  }
  isHawker800XP() {
    if (this.cached !== undefined) return this.cached;
    const xml = document.querySelector("wt21-fmc").xmlConfig;
    if (
      xml &&
      new XMLSerializer().serializeToString(xml).toLowerCase().includes("800xp")
    ) {
      return (this.cached = true);
    }
    this.cached = /h25b|800xp/i.test(
      SimVar.GetSimVarValue("ATC MODEL", "string") || "",
    );
    return this.cached;
  }

  onInit() {}
  onInstalled() {}
  registerFmcExtensions(context) {
    if (!this.isHawker800XP()) return;
    this.renderer = context.renderer;
    this.cduRenderer = new CduRenderer(this.renderer, this.binder);

    context.addPluginPageRoute(
      "/datalink-extra/atis",
      DatalinkAtisPage,
      undefined,
      {},
    );
    context.addPluginPageRoute(
      "/datalink-extra/twip",
      DatalinkTwipPage,
      undefined,
      {},
    );
    context.addPluginPageRoute("/datalink-extra/fans", FansPage, undefined, {});

    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/request-menu",
      FansRequestPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/send-msgs",
      DatalinkSendMessagesPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/messages",
      DatalinkCombinedMessagesPage,
      undefined,
      {},
    );
    context.addPluginPageRoute(
      "/datalink-extra/recv-msgs",
      DatalinkReceivedMessagesPage,
      undefined,
      {},
    );
    context.addPluginPageRoute(
      "/datalink-extra/message",
      DatalinkMessagePage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/status",
      CpdlcStatusPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/posrep",
      DatalinkPosReportPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/direct",
      DatalinkDirectToPage,
      undefined,
      {},
    );
    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/level",
      DatalinkLevelPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/cpdlc/speed",
      DatalinkSpeedPage,
      undefined,
      {},
    );

    context.addPluginPageRoute(
      "/datalink-extra/telex",
      DatalinkTelexPage,
      undefined,
      {},
    );
    context.addPluginPageRoute(
      "/datalink-extra/oceanic",
      DatalinkOceanicRequestPage,
      undefined,
      {},
    );


    context.addPluginPageRoute(
      "/datalink-extra/predep",
      DatalinkPreDepartureRequestPage,
      undefined,
      {},
    );


    context.attachPageExtension(UserSettingsPage, AcarsSettingsExtension);
    context.attachPageExtension(DataLinkMenuPage, DatalinkPageExtension);
    context.attachPageExtension(IndexPage, IndexPageExtension);

    if (this.binder.isPrimaryInstrument) {
      MessageDefinitions.definitions.set("800xp_acars_dl_message", new OperatingMessage([new MessageDefinition("DL MESSAGE", MESSAGE_TARGET.FMC)], MESSAGE_LEVEL.White, 60))
      MessageDefinitions.definitions.set("800xp_acars_atc_message", new OperatingMessage([new MessageDefinition("ATC MESSAGE", MESSAGE_TARGET.FMC)], MESSAGE_LEVEL.White, 60))
      MessageDefinitions.definitions.set("800xp_acars_atc_message_pfd", new OperatingMessage([new MessageDefinition("ATC MESSAGE", MESSAGE_TARGET.MAP_MID)], MESSAGE_LEVEL.White, 60))
      this.client = acarsService(this.binder.bus);
    }
  }
}

registerPlugin(Hawker800XpAcars);
