import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["gray", "green", "orange", "red"];

  return (
      <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
        <Card>
          <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Notificaçoes
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
                <Alert
                    key={color}
                    open={showAlerts[color]}
                    color={color}
                    onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
                >
                  Notificação
                 
                </Alert>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader
              color="transparent"
              floated={false}
              shadow={false}
              className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Notificações
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4">
            {alerts.map((color) => (
                <Alert
                    key={color}
                    open={showAlertsWithIcon[color]}
                    color={color}
                    icon={
                      <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
                    }
                    onClose={() => setShowAlertsWithIcon((current) => ({
                      ...current,
                      [color]: false,
                    }))}
                >
                  Notificação
                  
                </Alert>
            ))}
          </CardBody>
        </Card>
      </div>
  );
}

export default Notifications;