import createFetchMock, { FetchMock } from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker: FetchMock = createFetchMock(vi);
fetchMocker.enableMocks();

// NOTE: Disable mocking fetch by default
fetchMocker.dontMock();