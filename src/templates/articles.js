import React from "react";
import { kebabCase } from "lodash";
import { Link, graphql } from "gatsby";
import { Emojione } from "react-emoji-render";
import PropTypes from "prop-types";
import { GatsbyImage } from "gatsby-plugin-image";
import getAllArticles from "../utils/getAllArticles";
import Layout from "../components/layout";
import { Card } from "./projects";
import SEO from "../components/seo";
import replaceAll from "replaceall";

export const CardText = ({
  title,
  desc,
  excerpt,
  tags,
  slug,
  hideTags,
  bg,
  text,
  noMargin,
}) => (
  <Link to={slug} key={slug} className=" h-full">
    <div
      className={`cursor-pointer  h-full ${
        noMargin ? "" : "mb-3"
      } duration-500 ease-in-out transform hover:scale-105`}
    >
      <div
        className={`relative p-8 ${hideTags ? "" : "pb-16"} ${
          bg ? bg : "bg-default"
        } h-full  ${text ? text : "text-default"} shadow-lg rounded-lg`}
      >
        <div>
          <h2 className="text-2xl font-semibold">
            <Emojione text={title} className="flex flex-wrap items-center" />
          </h2>
          <p className="mt-2">{desc ? desc : excerpt}</p>
        </div>
        {!hideTags && (
          <div className="absolute bottom-0">
            <div className="flex flex-wrap mb-5">
              {tags.slice(0, 3).map((tag) => (
                <Link key={tag} className="tag" to={`/tags/${tag}`}>
                  {tag.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </Link>
);

CardText.propTypes = {
  title: PropTypes.string.isRequired,
  bg: PropTypes.string,
  text: PropTypes.string,
  noMargin: PropTypes.bool,
  slug: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  hideTags: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export const pathToTitle = (path) => {
  let clean = path
    .replace("/articles/", "")
    .split("/")
    .join("")
    .split("-")
    .join(" ");
  return clean.replace(
    /((?:^|\.)\w|\b(?!(?:a|amid|an|and|anti|as|at|but|but|by|by|down|for|for|for|from|from|in|into|like|near|nor|of|of|off|on|on|onto|or|over|past|per|plus|save|so|than|the|to|to|up|upon|via|with|without|yet)\b)\w)/g,
    function (character) {
      return character.toUpperCase();
    }
  );
};

export const createTagGroup = (tags) =>
  tags.map((tag) => (
    <Link to={`/tags/${kebabCase(tag)}`} key={tag}>
      <p className="tag">{tag.toUpperCase()}</p>
    </Link>
  ));

export const Article = ({ title, slug, coverimg, excerpt, key, tags }) => {
  return (
    <Link to={slug} className="text-secondary h-full" id={key}>
      <div className="bg-secondary rounded h-full">
        <div
          className="col-xs-12 col-md-5 margin-2-b"
          style={{ position: "relative" }}
        >
          <GatsbyImage
            image={coverimg.childImageSharp.gatsbyImageData}
            className="shadow"
            objectFit="cover"
            style={{ width: "100%", height: "100%", maxHeight: 220 }} />
        </div>
        <div className="p-3">
          <h2 className="text-2xl font-semibold">{title}</h2>

          <p className="text-sm">{excerpt}</p>
          <div className="flex flex-wrap -mx-1 my-1">
            {createTagGroup(tags)}
          </div>
        </div>
      </div>
    </Link>
  );
};

Article.propTypes = {
  title: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  pubDate: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  coverimg: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const Articles = ({ data }) => {
  const { currentPage, numPages, slug } = data.sitePage.context;
  const allArticles = getAllArticles(data);
  const popular = data.allPageViews.edges.filter(
    (item) => !/\/articles\/\d$/g.test(item.node.path)
  );
  const tags = data.tags.group
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10)
    .map((item) => item.tag);

  const previousArticles =
    currentPage - 1 === 1 ? "/articles" : "/articles/" + (currentPage - 1);

  const nextArticles = "/articles/" + (currentPage + 1);
  return (
    <Layout>
      <SEO title="Articles" socialcard="social-card-articles" video={`${replaceAll("/", "-", slug.slice(1))}.mp4`}/>
      <div className=" bg-default">
        <section className="container mx-auto">
          <div className="flex-1 w-full max-w-4xl xl:max-w-full px-4 py-8  mx-auto md:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 xl:gap-6">
              <div className="col-span-3">
                <h1 className="text-xl text-secondary mb-3">RECENT POSTS</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mb-5">
                  {allArticles.map((item) => (
                    <div className="h-full pb-3 md:pb-0" key={item.fields.slug}>
                      <Card
                        bg="bg-white"
                        text="text-grey"
                        {...item}
                        {...item.fields}
                        path={item.fields.slug}
                      />
                    </div>
                  ))}
                </div>
                <ul className="flex justify-center my-10">
                  {currentPage > 1 && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link
                        className="flex items-center font-bold"
                        to={previousArticles}
                      >
                        <span className="mx-1">Previous</span>
                      </Link>
                    </li>
                  )}
                  {currentPage === numPages && currentPage - 3 >= 1 && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link
                        className="font-bold"
                        to={
                          currentPage - 3 === 1
                            ? "/articles"
                            : "/articles/" + (currentPage - 3)
                        }
                      >
                        {currentPage - 3}
                      </Link>
                    </li>
                  )}
                  {currentPage - 2 >= 1 && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light hover:text-gray-200 rounded-lg">
                      <Link
                        className="font-bold"
                        to={
                          currentPage - 2 === 1
                            ? "/articles"
                            : "/articles/" + (currentPage - 2)
                        }
                      >
                        {currentPage - 2}
                      </Link>
                    </li>
                  )}
                  {currentPage > 1 && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link className="font-bold" to={previousArticles}>
                        {currentPage - 1}
                      </Link>
                    </li>
                  )}

                  <li className="mx-1 px-3 py-2 bg-accent text-primary hover:bg-accent-light rounded-lg">
                    <Link className="font-bold" href="#">
                      {currentPage}
                    </Link>
                  </li>
                  {currentPage !== numPages && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link className="font-bold" to={nextArticles}>
                        {currentPage + 1}
                      </Link>
                    </li>
                  )}
                  {currentPage + 2 <= numPages && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link
                        className="font-bold"
                        to={"/articles/" + (currentPage + 2)}
                      >
                        {currentPage + 2}
                      </Link>
                    </li>
                  )}
                  {currentPage === 1 && currentPage + 3 <= numPages && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link
                        className="font-bold"
                        to={"/articles/" + (currentPage + 3)}
                      >
                        {currentPage + 3}
                      </Link>
                    </li>
                  )}
                  {currentPage !== numPages && (
                    <li className="mx-1 px-3 py-2 bg-secondary text-secondary hover:bg-secondary-light rounded-lg">
                      <Link
                        className="flex items-center font-bold"
                        to={nextArticles}
                      >
                        <span className="mx-1">Next</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              <div className="block">
                <div className="text-secondary top-0 md:pt-10 md:sticky">
                  <div>
                    <h1 className="text-xl text-secondary mb-3">
                      POPULAR CONTENT
                    </h1>
                    {popular.map((item) => (
                      <div key={item.node.path}>
                        <Link to={item.node.path} className="is-special-blue">
                          <p className="text-link">
                            {pathToTitle(item.node.path)}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="">
                    <h1 className="text-xl text-secondary my-3">TOP TAGS</h1>
                    <div className="flex flex-wrap margin-3-tb">
                      {createTagGroup(tags)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

Articles.propTypes = {
  data: PropTypes.shape({
    sitePage: PropTypes.shape({
      context: PropTypes.shape({
        limit: PropTypes.number.isRequired,
        skip: PropTypes.number.isRequired,
        numPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
      }),
    }),
    allPageViews: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    tags: PropTypes.shape({
      group: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
};

export const pageQuery = graphql`query Articles($skip: Int!, $limit: Int!, $slug: String!) {
  sitePage(path: {eq: $slug}) {
    context {
      limit
      skip
      numPages
      currentPage
      slug
    }
  }
  allPageViews(filter: {path: {regex: "//articles/[^?/]*$/g"}}, sort: {fields: totalCount, order: DESC}, limit: 8) {
    edges {
      node {
        totalCount
        path
      }
    }
  }
  tags: allMdx(filter: {frontmatter: {type: {eq: "Article"}}}) {
    group(field: frontmatter___tags) {
      tag: fieldValue
      totalCount
    }
  }
  allMdx(limit: $limit, skip: $skip, filter: {frontmatter: {type: {eq: "Article"}}}, sort: {fields: frontmatter___date, order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          date
          desc
          path
          featured
          tags
          coverimg {
            childImageSharp {
              gatsbyImageData(width: 450)
            }
          }
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
}
`;

export default Articles;
