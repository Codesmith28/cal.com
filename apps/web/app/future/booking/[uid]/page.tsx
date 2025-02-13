import OldPage, { type PageProps } from "@pages/booking/[uid]";
import { withAppDirSsr } from "app/WithAppDirSsr";
import type { Params, SearchParams } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { type GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";

import { BookingStatus } from "@calcom/prisma/enums";

import { getServerSideProps } from "@lib/booking/[uid]/getServerSideProps";
import { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { bookingInfo, eventType, recurringBookings } = await getData(
    buildLegacyCtx(headers(), cookies(), params, searchParams) as unknown as GetServerSidePropsContext
  );
  const needsConfirmation = bookingInfo.status === BookingStatus.PENDING && eventType.requiresConfirmation;

  return await _generateMetadata(
    (t) =>
      t(`booking_${needsConfirmation ? "submitted" : "confirmed"}${recurringBookings ? "_recurring" : ""}`),
    (t) =>
      t(`booking_${needsConfirmation ? "submitted" : "confirmed"}${recurringBookings ? "_recurring" : ""}`)
  );
};

const getData = withAppDirSsr<PageProps>(getServerSideProps);

export default WithLayout({ getLayout: null, getData, Page: OldPage });
