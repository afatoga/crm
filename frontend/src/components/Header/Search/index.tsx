import * as React from "react";
import { alpha, InputBase, styled, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "../../../utils/utilityFunctions";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import { useAuth } from "../../../hooks/useAuth";

export const Search = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = React.useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const { operations } = useSearch();
  const [getSearchResultsHandler, getSearchResultsRequest] =
    operations.getSearchResults;

  const debounceSubmitRequest = React.useCallback(
    debounce((value: string) => {
      getSearchResultsHandler({
        variables: {
          searchedText: value,
          appUserGroupId: user.currentAppUserGroupId,
        },
      });
    }, 700),
    [inputValue]
  );

  const resetInput = () => {
    setInputValue("");
  };

  const viewCurrentResults = () => {
    if (
      getSearchResultsRequest.data.searchResults.count > 0 &&
      location.pathname !== "/search"
    ) {
      navigate("/search");
    }
  };

  React.useEffect(() => {
    if (inputValue.length > 2) {
      debounceSubmitRequest(inputValue);
    }
  }, [inputValue]);

  return (
    <Box>
      <SearchWrapper>
        <SearchIconWrapper>
          <SearchIcon onClick={viewCurrentResults} />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={`${t("userActions.search")}...`}
          inputProps={{ "aria-label": "search" }}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        {inputValue.length > 0 && (
          <ClearIconWrapper>
            <ClearIcon fontSize="small" onClick={resetInput} />
          </ClearIconWrapper>
        )}
      </SearchWrapper>
    </Box>
  );
};

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  display: "inline-flex",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  cursor: "pointer",
  zIndex: "10",
}));
const ClearIconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  cursor: "pointer",
  zIndex: "10",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
