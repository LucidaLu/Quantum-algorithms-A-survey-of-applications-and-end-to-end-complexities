# Loading classical data

The end-to-end quantum applications covered in this document have classical inputs and classical outputs, in the sense that the problem is specified by some set of classical data, and the solution to the problem should be a different set of classical data. In some cases, the input data is relatively small, and loading it into the algorithm does not contribute significantly to the cost of the algorithm. In other cases—for example, "big data" problems within the areas of [machine learning](../../areas-of-application/machine-learning-with-classical-data/introduction.md#machine-learning-with-classical-data) and [finance](../../areas-of-application/finance/introduction.md#finance)—the dominant costs, both for classical and quantum algorithms, can be related to how the algorithms load and manipulate this large quantity of input data. Consequently, the availability of quantum speedups for these problems is often dependent on the ability to quickly and coherently access this data. The true cost of this access is the source of significant subtlety in many end-to-end quantum algorithms.





