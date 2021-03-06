const path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators
	const postTemplate = path.resolve('src/templates/post.js')

	return graphql(`{
        allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 1000
        ){
            edges {
                node {
                    excerpt(pruneLength: 250)
                    html
                    id
                    timeToRead
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
				        edited(formatString: "MMMM DD, YYYY")
                        path
                        title
                        next
                        id
                        thumbnail {
                            childImageSharp {
                                sizes(maxWidth: 630 ) {
                                    originalImg
                                }
                            }
                        }
                    }
                }
            }
        }}`).then(res => {
		if (res.errors) {
			return Promise.reject(res.errors)
		}

		return res.data.allMarkdownRemark.edges.forEach(({ node }) => {
			createPage({
				path: node.frontmatter.path,
				component: postTemplate
			})
		})
	})
}
