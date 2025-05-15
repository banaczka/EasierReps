import notifee, { RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';

function calculateNextTrigger(hour: number, minute: number): number {
  const now = new Date();
  const nextTrigger = new Date();

  nextTrigger.setHours(hour, minute, 0, 0);

  if (nextTrigger <= now) {
    nextTrigger.setDate(nextTrigger.getDate() + 1);
  }

  return nextTrigger.getTime();
}

async function scheduleNotification(title: string, body: string, hour: number, minute: number) {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    const triggerTime = calculateNextTrigger(hour, minute);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime,
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.cancelAllNotifications();

    await notifee.createTriggerNotification(
      {
        title: title,
        body: body,
        android: {
          channelId: 'default',
        },
      },
      trigger
    );

    console.log(`Powiadomienie ustawione na ${hour}:${minute}`);
  } catch (error) {
    console.error('Błąd ustawiania powiadomienia:', error);
  }
}

async function cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
      console.log('Wszystkie lokalne powiadomienia zostały anulowane.');
    } catch (error) {
      console.error('Błąd anulowania powiadomień:', error);
    }
  }

export { cancelAllNotifications, scheduleNotification };

