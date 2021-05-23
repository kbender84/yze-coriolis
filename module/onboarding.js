export async function showOnboardingMessage() {
  const triggered = game.settings.get("yzecoriolis", "firstLaunch");
  console.log("triggered", triggered);
  if (triggered) {
    return;
  }
  const path = "systems/yzecoriolis/data/firstlaunch.html";
  const response = await $.get(path);
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ alias: "Coriolis - The Third Horizon" }),
    whisper: [game.user],
    content: response,
  });

  await game.settings.set("yzecoriolis", "firstLaunch", true);
}

export async function importShipSheetTutorial() {
  if (game.user.isGM) {
    try {
      const newVer = "1";
      const journalName = "Ship Sheet Instructions";
      if (game.journal.getName(journalName) !== null) {
        if (
          game.journal.getName(journalName).getFlag("yzecoriolis", "ver") <
            newVer ||
          game.journal.getName(journalName).getFlag("yzecoriolis", "ver") ===
            undefined
        ) {
          await game.journal.getName(journalName).delete();
          await game.journal.importFromCollection(
            "yzecoriolis.ship_sheet_instructions",
            `0QlMn9tJBwKSZ9a6`
          );
          await game.journal
            .getName(journalName)
            .setFlag("yzecoriolis", "ver", newVer);
          console.log("New version of Coriolis Ship Sheet Instructions.");
        }
      } else {
        await game.journal.importFromCollection(
          "yzecoriolis.ship_sheet_instructions",
          `0QlMn9tJBwKSZ9a6`
        );
        game.journal.getName(journalName).setFlag("yzecoriolis", "ver", newVer);
      }
    } catch (error) {
      console.warn("failed to load up ship sheet instructions", error);
    }
  }
}